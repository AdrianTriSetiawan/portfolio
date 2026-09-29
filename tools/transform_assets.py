import json
import struct
import io
import os
import numpy as np
from PIL import Image, ImageDraw

def transform_models_glb():
    print("Transforming Models.glb...")
    source_file = 'public/models/Models.glb.bak' if os.path.exists('public/models/Models.glb.bak') else 'public/models/Models.glb'
    with open(source_file, 'rb') as f:
        f.read(12)
        json_len = int.from_bytes(f.read(4), 'little')
        f.read(4)
        json_data = json.loads(f.read(json_len).decode('utf-8'))
        bin_len = int.from_bytes(f.read(4), 'little')
        f.read(4)
        bin_data = bytearray(f.read(bin_len))

    # 1. Transform Trees to Blooming Sakura
    trees_img_def = json_data['images'][15]
    bv_trees = json_data['bufferViews'][trees_img_def['bufferView']]
    trees_bytes = bin_data[bv_trees['byteOffset']:bv_trees['byteOffset'] + bv_trees['byteLength']]
    im_trees = Image.open(io.BytesIO(trees_bytes)).convert('RGB')
    
    arr_trees = np.array(im_trees).astype(float)
    r, g, b = arr_trees[:,:,0], arr_trees[:,:,1], arr_trees[:,:,2]
    green_excess = g - np.maximum(r, b)
    is_foliage = (green_excess > 4) | ((g > 18) & (g > r * 1.08) & (g > b * 1.08))
    
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    lum_vals = lum[is_foliage]
    lum_min = np.percentile(lum_vals, 2)
    lum_max = np.percentile(lum_vals, 98)
    lum_norm = np.clip((lum - lum_min) / (lum_max - lum_min + 1e-5), 0, 1)
    
    shadow_c = np.array([210.0, 80.0, 128.0])
    mid_c = np.array([255.0, 175.0, 202.0])
    high_c = np.array([255.0, 242.0, 248.0])
    
    new_r = np.where(lum_norm < 0.5,
        shadow_c[0] + (mid_c[0] - shadow_c[0]) * (lum_norm / 0.5),
        mid_c[0] + (high_c[0] - mid_c[0]) * ((lum_norm - 0.5) / 0.5))
    new_g = np.where(lum_norm < 0.5,
        shadow_c[1] + (mid_c[1] - shadow_c[1]) * (lum_norm / 0.5),
        mid_c[1] + (high_c[1] - mid_c[1]) * ((lum_norm - 0.5) / 0.5))
    new_b = np.where(lum_norm < 0.5,
        shadow_c[2] + (mid_c[2] - shadow_c[2]) * (lum_norm / 0.5),
        mid_c[2] + (high_c[2] - mid_c[2]) * ((lum_norm - 0.5) / 0.5))
        
    arr_trees[is_foliage, 0] = new_r[is_foliage]
    arr_trees[is_foliage, 1] = new_g[is_foliage]
    arr_trees[is_foliage, 2] = new_b[is_foliage]
    
    out_trees = Image.fromarray(np.clip(arr_trees, 0, 255).astype(np.uint8))
    trees_out_buf = io.BytesIO()
    out_trees.save(trees_out_buf, format='WEBP', quality=88)
    trees_out_bytes = trees_out_buf.getvalue()

    # 2. Transform Home Texture to Ryokan Architecture
    home_img_def = json_data['images'][14]
    bv_home = json_data['bufferViews'][home_img_def['bufferView']]
    home_bytes = bin_data[bv_home['byteOffset']:bv_home['byteOffset'] + bv_home['byteLength']]
    im_home = Image.open(io.BytesIO(home_bytes)).convert('RGB')
    
    home_node = [n for n in json_data['nodes'] if n.get('name') == 'Home_lp'][0]
    mesh = json_data['meshes'][home_node['mesh']]
    prim = mesh['primitives'][0]
    
    pos_acc = json_data['accessors'][prim['attributes']['POSITION']]
    pos_bv = json_data['bufferViews'][pos_acc['bufferView']]
    pos_off = pos_bv.get('byteOffset', 0) + pos_acc.get('byteOffset', 0)
    
    uv_acc = json_data['accessors'][prim['attributes']['TEXCOORD_0']]
    uv_bv = json_data['bufferViews'][uv_acc['bufferView']]
    uv_off = uv_bv.get('byteOffset', 0) + uv_acc.get('byteOffset', 0)
    
    ind_acc = json_data['accessors'][prim['indices']]
    ind_bv = json_data['bufferViews'][ind_acc['bufferView']]
    ind_off = ind_bv.get('byteOffset', 0) + ind_acc.get('byteOffset', 0)
    fmt = '<H' if ind_acc['componentType'] == 5123 else '<I'
    sz = 2 if ind_acc['componentType'] == 5123 else 4
    
    indices = [struct.unpack_from(fmt, bin_data, ind_off + i * sz)[0] for i in range(ind_acc['count'])]
    vertices = [struct.unpack_from('<3f', bin_data, pos_off + i * 12) for i in range(pos_acc['count'])]
    uvs = [struct.unpack_from('<2f', bin_data, uv_off + i * 8) for i in range(pos_acc['count'])]
    
    w, h = im_home.size
    roof_mask = Image.new('L', (w, h), 0)
    wall_mask = Image.new('L', (w, h), 0)
    timber_mask = Image.new('L', (w, h), 0)
    
    r_draw = ImageDraw.Draw(roof_mask)
    w_draw = ImageDraw.Draw(wall_mask)
    t_draw = ImageDraw.Draw(timber_mask)
    
    num_triangles = len(indices) // 3
    for t in range(num_triangles):
        v0, v1, v2 = indices[t*3], indices[t*3+1], indices[t*3+2]
        tri_verts = [vertices[v0], vertices[v1], vertices[v2]]
        avg_y = sum(v[1] for v in tri_verts) / 3
        poly = [(uvs[vi][0] * w, (1.0 - uvs[vi][1]) * h) for vi in [v0, v1, v2]]
        if avg_y > 5.5:
            r_draw.polygon(poly, fill=255)
        elif avg_y > 2.2:
            w_draw.polygon(poly, fill=255)
        else:
            t_draw.polygon(poly, fill=255)
            
    arr_home = np.array(im_home).astype(float)
    r_arr = np.array(roof_mask) > 0
    w_arr = np.array(wall_mask) > 0
    t_arr = np.array(timber_mask) > 0
    
    lum_home = 0.299 * arr_home[:,:,0] + 0.587 * arr_home[:,:,1] + 0.114 * arr_home[:,:,2]
    lum_norm = lum_home / 255.0
    
    slate_base = np.array([44.0, 48.0, 62.0])
    for c in range(3):
        arr_home[r_arr, c] = np.clip(slate_base[c] * (0.35 + 0.95 * lum_norm[r_arr]), 0, 255)
        
    parchment = np.array([246.0, 242.0, 230.0])
    for c in range(3):
        arr_home[w_arr, c] = np.clip(parchment[c] * (0.65 + 0.45 * lum_norm[w_arr]), 0, 255)
        
    cedar = np.array([72.0, 52.0, 36.0])
    for c in range(3):
        arr_home[t_arr, c] = np.clip(cedar[c] * (0.5 + 0.75 * lum_norm[t_arr]), 0, 255)
        
    out_home = Image.fromarray(np.clip(arr_home, 0, 255).astype(np.uint8))
    home_out_buf = io.BytesIO()
    out_home.save(home_out_buf, format='WEBP', quality=88)
    home_out_bytes = home_out_buf.getvalue()

    # Pack Updated Binary Buffer
    new_bin_data = bytearray()
    for i, bv in enumerate(json_data['bufferViews']):
        old_off = bv.get('byteOffset', 0)
        old_len = bv['byteLength']
        
        while len(new_bin_data) % 4 != 0:
            new_bin_data.append(0)
        new_off = len(new_bin_data)
        
        if i == trees_img_def['bufferView']:
            new_bin_data.extend(trees_out_bytes)
            bv['byteOffset'] = new_off
            bv['byteLength'] = len(trees_out_bytes)
        elif i == home_img_def['bufferView']:
            new_bin_data.extend(home_out_bytes)
            bv['byteOffset'] = new_off
            bv['byteLength'] = len(home_out_bytes)
        else:
            chunk = bin_data[old_off:old_off + old_len]
            new_bin_data.extend(chunk)
            bv['byteOffset'] = new_off
            bv['byteLength'] = len(chunk)

    while len(new_bin_data) % 4 != 0:
        new_bin_data.append(0)

    json_data['buffers'][0]['byteLength'] = len(new_bin_data)
    json_bytes = json.dumps(json_data, separators=(',', ':')).encode('utf-8')
    while len(json_bytes) % 4 != 0:
        json_bytes += b' '

    out_file = 'public/models/Models.glb'
    total_file_len = 12 + 8 + len(json_bytes) + 8 + len(new_bin_data)
    with open(out_file, 'wb') as f:
        f.write(b'glTF')
        f.write(struct.pack('<I', 2))
        f.write(struct.pack('<I', total_file_len))
        f.write(struct.pack('<I', len(json_bytes)))
        f.write(b'JSON')
        f.write(json_bytes)
        f.write(struct.pack('<I', len(new_bin_data)))
        f.write(b'BIN\x00')
        f.write(new_bin_data)
    print("Models.glb transformed successfully!")

def transform_player_glb():
    print("Transforming Player.glb into Cute Japanese Anime Girl...")
    source_file = 'public/models/Player.glb.bak' if os.path.exists('public/models/Player.glb.bak') else 'public/models/Player.glb'
    with open(source_file, 'rb') as f:
        f.read(12)
        json_len = int.from_bytes(f.read(4), 'little')
        f.read(4)
        json_data = json.loads(f.read(json_len).decode('utf-8'))
        bin_len = int.from_bytes(f.read(4), 'little')
        f.read(4)
        bin_data = bytearray(f.read(bin_len))

    prim = json_data['meshes'][0]['primitives'][0]
    pos_acc = json_data['accessors'][prim['attributes']['POSITION']]
    pos_bv = json_data['bufferViews'][pos_acc['bufferView']]
    pos_off = pos_bv.get('byteOffset', 0) + pos_acc.get('byteOffset', 0)
    
    ind_acc = json_data['accessors'][prim['indices']]
    ind_bv = json_data['bufferViews'][ind_acc['bufferView']]
    ind_off = ind_bv.get('byteOffset', 0) + ind_acc.get('byteOffset', 0)
    fmt = '<H' if ind_acc['componentType'] == 5123 else '<I'
    sz = 2 if ind_acc['componentType'] == 5123 else 4

    indices = [struct.unpack_from(fmt, bin_data, ind_off + i * sz)[0] for i in range(ind_acc['count'])]
    vertices = [list(struct.unpack_from('<3f', bin_data, pos_off + i * 12)) for i in range(pos_acc['count'])]

    # Collapse ALL glasses triangles by geometric bounds and boy hair spikes
    glasses_and_boy_hair = set()
    for t in range(len(indices) // 3):
        v0, v1, v2 = indices[t*3], indices[t*3+1], indices[t*3+2]
        pts = [vertices[v0], vertices[v1], vertices[v2]]
        avg_x = sum(p[0] for p in pts) / 3
        avg_y = sum(p[1] for p in pts) / 3
        avg_z = sum(p[2] for p in pts) / 3

        # 1. Front Glasses frames, lenses, and bridge
        is_glasses_front = (2.42 <= avg_y <= 2.72 and avg_z > 0.80 and abs(avg_x) < 0.58)
        # 2. Side temples and hinges of glasses
        is_glasses_temples = (2.44 <= avg_y <= 2.66 and avg_z > 0.70 and abs(avg_x) > 0.42)
        # 3. Boy spiky hair strands that stick out
        is_boy_hair = (avg_y > 2.70 and (avg_y > 3.25 or avg_z < -0.3 or abs(avg_x) > 0.65))

        if is_glasses_front or is_glasses_temples or is_boy_hair:
            glasses_and_boy_hair.add(t)

    print(f"Collapsing {len(glasses_and_boy_hair)} triangles (100% of glasses and boy spiky hair)...")

    for t in glasses_and_boy_hair:
        v0 = indices[t * 3]
        struct.pack_into(fmt, bin_data, ind_off + (t * 3 + 1) * sz, v0)
        struct.pack_into(fmt, bin_data, ind_off + (t * 3 + 2) * sz, v0)

    # 2. Update Anime Girl Texture
    img_def = json_data['images'][1]
    bv_tex = json_data['bufferViews'][img_def['bufferView']]
    old_tex_bytes = bin_data[bv_tex['byteOffset']:bv_tex['byteOffset'] + bv_tex['byteLength']]
    im_char = Image.open(io.BytesIO(old_tex_bytes)).convert('RGBA')

    skin_overlay = Image.new('RGBA', im_char.size, (0, 0, 0, 0))
    skin_draw = ImageDraw.Draw(skin_overlay)

    # 100% erase old glasses texture region
    skin_draw.rectangle([140, 240, 280, 310], fill=(255, 238, 228, 255))

    # Cover entire face with clean porcelain skin, completely painting over glasses marks
    skin_draw.rectangle([320, 250, 445, 425], fill=(255, 238, 228, 255)) # Porcelain face
    skin_draw.rectangle([455, 370, 505, 460], fill=(255, 238, 228, 255)) # Left temple skin
    skin_draw.rectangle([350, 110, 400, 210], fill=(255, 238, 228, 255)) # Right temple skin

    # Rosy anime blushing cheeks
    skin_draw.ellipse([335, 335, 375, 360], fill=(255, 160, 180, 190))
    skin_draw.ellipse([385, 335, 425, 360], fill=(255, 160, 180, 190))

    # Cute sparkling anime eyes:
    # Left eye:
    skin_draw.ellipse([345, 298, 375, 332], fill=(32, 22, 54, 255)) # Outline
    skin_draw.ellipse([347, 303, 373, 330], fill=(75, 95, 210, 255)) # Sapphire iris
    skin_draw.ellipse([350, 308, 370, 327], fill=(145, 130, 245, 255)) # Iris gradient
    skin_draw.ellipse([353, 314, 367, 324], fill=(20, 14, 40, 255)) # Pupil
    skin_draw.ellipse([349, 304, 357, 312], fill=(255, 255, 255, 255)) # Star glint
    skin_draw.ellipse([363, 321, 368, 326], fill=(255, 255, 255, 220)) # Small glint
    skin_draw.arc([343, 293, 377, 316], start=180, end=360, fill=(24, 16, 32, 255), width=4)

    # Right eye:
    skin_draw.ellipse([385, 298, 415, 332], fill=(32, 22, 54, 255)) # Outline
    skin_draw.ellipse([387, 303, 413, 330], fill=(75, 95, 210, 255)) # Sapphire iris
    skin_draw.ellipse([390, 308, 410, 327], fill=(145, 130, 245, 255)) # Iris gradient
    skin_draw.ellipse([393, 314, 407, 324], fill=(20, 14, 40, 255)) # Pupil
    skin_draw.ellipse([389, 304, 397, 312], fill=(255, 255, 255, 255)) # Star glint
    skin_draw.ellipse([403, 321, 408, 326], fill=(255, 255, 255, 220)) # Small glint
    skin_draw.arc([383, 293, 417, 316], start=180, end=360, fill=(24, 16, 32, 255), width=4)

    # Cute anime mouth
    skin_draw.ellipse([375, 366, 385, 372], fill=(235, 95, 120, 240))

    # Traditional Japanese Miko / Kimono Attire:
    skin_draw.rectangle([235, 430, 385, 512], fill=(252, 250, 246, 255)) # Pure white miko robe
    skin_draw.polygon([(255, 430), (305, 490), (320, 490), (270, 430)], fill=(195, 28, 28, 255))
    skin_draw.polygon([(365, 430), (315, 490), (300, 490), (350, 430)], fill=(215, 38, 38, 255))
    skin_draw.line([(235, 475), (385, 475)], fill=(245, 175, 45, 255), width=5) # Golden obijime

    # Crimson red hakama / skirt
    skin_draw.rectangle([0, 250, 50, 345], fill=(195, 28, 28, 255))
    skin_draw.rectangle([345, 65, 445, 115], fill=(195, 28, 28, 255))
    skin_draw.rectangle([350, 180, 445, 280], fill=(215, 35, 35, 255))

    # Tabi socks & geta
    skin_draw.rectangle([435, 335, 475, 415], fill=(255, 255, 255, 255))
    skin_draw.rectangle([485, 305, 512, 370], fill=(255, 255, 255, 255))
    skin_draw.line([(440, 395), (468, 395)], fill=(220, 30, 30, 255), width=4)
    skin_draw.line([(490, 355), (510, 355)], fill=(220, 30, 30, 255), width=4)

    im_char = Image.alpha_composite(im_char, skin_overlay).convert('RGB')
    char_out_buf = io.BytesIO()
    im_char.save(char_out_buf, format='WEBP', quality=90)
    char_out_bytes = char_out_buf.getvalue()

    # Pack binary buffer
    new_bin_data = bytearray()
    for i, bv in enumerate(json_data['bufferViews']):
        old_off = bv.get('byteOffset', 0)
        old_len = bv['byteLength']
        
        while len(new_bin_data) % 4 != 0:
            new_bin_data.append(0)
        new_off = len(new_bin_data)
        
        if i == img_def['bufferView']:
            new_bin_data.extend(char_out_bytes)
            bv['byteOffset'] = new_off
            bv['byteLength'] = len(char_out_bytes)
        else:
            chunk = bin_data[old_off:old_off + old_len]
            new_bin_data.extend(chunk)
            bv['byteOffset'] = new_off
            bv['byteLength'] = len(chunk)

    while len(new_bin_data) % 4 != 0:
        new_bin_data.append(0)

    json_data['buffers'][0]['byteLength'] = len(new_bin_data)
    json_bytes = json.dumps(json_data, separators=(',', ':')).encode('utf-8')
    while len(json_bytes) % 4 != 0:
        json_bytes += b' '

    out_file = 'public/models/Player.glb'
    total_file_len = 12 + 8 + len(json_bytes) + 8 + len(new_bin_data)
    with open(out_file, 'wb') as f:
        f.write(b'glTF')
        f.write(struct.pack('<I', 2))
        f.write(struct.pack('<I', total_file_len))
        f.write(struct.pack('<I', len(json_bytes)))
        f.write(b'JSON')
        f.write(json_bytes)
        f.write(struct.pack('<I', len(new_bin_data)))
        f.write(b'BIN\x00')
        f.write(new_bin_data)
    print("Player.glb updated and saved successfully!")

if __name__ == '__main__':
    transform_models_glb()
    transform_player_glb()
