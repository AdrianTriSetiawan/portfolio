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

    # Triangle grouping into components
    num_triangles = len(indices) // 3
    tri_verts = [indices[i*3:(i+1)*3] for i in range(num_triangles)]

    from collections import defaultdict
    v_to_tri = defaultdict(list)
    for t_idx, t in enumerate(tri_verts):
        for v in t: v_to_tri[v].append(t_idx)

    tri_adj = defaultdict(set)
    for v, tris in v_to_tri.items():
        for t1 in tris:
            for t2 in tris:
                if t1 != t2: tri_adj[t1].add(t2)

    visited = set()
    components = []
    for t in range(num_triangles):
        if t not in visited:
            comp = []
            q = [t]
            visited.add(t)
            while q:
                curr = q.pop()
                comp.append(curr)
                for neighbor in tri_adj[curr]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        q.append(neighbor)
            components.append(comp)

    # Collapse ALL components from 166 to 282 except 178 (which is face/eyes skin)
    # This completely eliminates 100% of the boy's short hair, sunglasses frames, hinges, and spikes!
    to_collapse = set()
    for comp_idx in range(166, len(components)):
        if comp_idx == 178:
            continue # KEEP the face and eyes skin
        for t in components[comp_idx]:
            to_collapse.add(t)

    print(f"Collapsing {len(to_collapse)} triangles (100% of boy hair and sunglasses)...")

    for t in to_collapse:
        v0 = indices[t * 3]
        struct.pack_into(fmt, bin_data, ind_off + (t * 3 + 1) * sz, v0)
        struct.pack_into(fmt, bin_data, ind_off + (t * 3 + 2) * sz, v0)

    # Update Anime Girl Texture
    img_def = json_data['images'][1]
    bv_tex = json_data['bufferViews'][img_def['bufferView']]
    old_tex_bytes = bin_data[bv_tex['byteOffset']:bv_tex['byteOffset'] + bv_tex['byteLength']]
    im_char = Image.open(io.BytesIO(old_tex_bytes)).convert('RGBA')

    skin_overlay = Image.new('RGBA', im_char.size, (0, 0, 0, 0))
    skin_draw = ImageDraw.Draw(skin_overlay)

    # 1. 100% Erase old glasses texture and paint face porcelain skin
    skin_draw.rectangle([140, 240, 280, 310], fill=(255, 238, 228, 255))
    skin_draw.rectangle([330, 260, 430, 410], fill=(255, 238, 228, 255))

    # 2. Smooth dark silky anime hair on hair UVs
    skin_draw.rectangle([0, 400, 200, 512], fill=(30, 26, 38, 255))
    skin_draw.rectangle([180, 335, 285, 495], fill=(30, 26, 38, 255))

    # 3. Rosy anime blushing cheeks
    skin_draw.ellipse([340, 335, 375, 358], fill=(255, 155, 175, 190))
    skin_draw.ellipse([385, 335, 420, 358], fill=(255, 155, 175, 190))

    # 4. Cute anime eyes:
    skin_draw.ellipse([345, 298, 375, 332], fill=(32, 22, 54, 255))
    skin_draw.ellipse([347, 303, 373, 330], fill=(75, 95, 210, 255))
    skin_draw.ellipse([350, 308, 370, 327], fill=(145, 130, 245, 255))
    skin_draw.ellipse([353, 314, 367, 324], fill=(20, 14, 40, 255))
    skin_draw.ellipse([349, 304, 357, 312], fill=(255, 255, 255, 255))
    skin_draw.ellipse([363, 321, 368, 326], fill=(255, 255, 255, 220))
    skin_draw.arc([343, 293, 377, 316], start=180, end=360, fill=(24, 16, 32, 255), width=4)

    skin_draw.ellipse([385, 298, 415, 332], fill=(32, 22, 54, 255))
    skin_draw.ellipse([387, 303, 413, 330], fill=(75, 95, 210, 255))
    skin_draw.ellipse([390, 308, 410, 327], fill=(145, 130, 245, 255))
    skin_draw.ellipse([393, 314, 407, 324], fill=(20, 14, 40, 255))
    skin_draw.ellipse([389, 304, 397, 312], fill=(255, 255, 255, 255))
    skin_draw.ellipse([403, 321, 408, 326], fill=(255, 255, 255, 220))
    skin_draw.arc([383, 293, 417, 316], start=180, end=360, fill=(24, 16, 32, 255), width=4)

    # 5. Cute anime mouth
    skin_draw.ellipse([375, 366, 385, 372], fill=(235, 95, 120, 240))

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
