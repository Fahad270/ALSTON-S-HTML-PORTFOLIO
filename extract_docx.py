import zipfile
import xml.etree.ElementTree as ET
import re
import sys

docx_path = r'C:\Users\Aryan Mejari\OneDrive\Desktop\ALSTON-S-HTML-PORTFOLIO\SIH_2026_PS26130_4_Day_Research_and_Architecture_Brief.docx'

with zipfile.ZipFile(docx_path, 'r') as zipf:
    with zipf.open('word/document.xml') as f:
        xml_content = f.read().decode('utf-8')

# Parse XML
root = ET.fromstring(xml_content)

# Define namespace
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def safe(s):
    if s is None:
        return ''
    return s.replace('\u2192', '->').replace('\u2013', '-').replace('\u2014', '-').replace('\u2018', "'").replace('\u2019', "'").replace('\u201c', '"').replace('\u201d', '"').replace('\ue200', '').replace('\uf0b7', '*').replace('\uf0a7', '').replace('\u2022', '*').replace('\u2026', '...').replace('\ue202', '').replace('\ue201', '').replace('\u2193', 'v').replace('\u2191', '^').replace('\u2190', '<-').replace('\u25cf', '*').replace('\u25aa', '*').replace('\u25a0', '[]').replace('\u2199', 'v').replace('\u2198', 'v').replace('\u2197', '^')

# Extract text from paragraphs
for para in root.findall('.//w:p', ns):
    texts = para.findall('.//w:t', ns)
    para_text = ''.join([t.text for t in texts if t.text])
    if para_text.strip():
        pPr = para.find('w:pPr', ns)
        style_name = ''
        if pPr is not None:
            pStyle = pPr.find('w:pStyle', ns)
            if pStyle is not None:
                style_name = pStyle.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val', '')
        print(f'[{safe(style_name)}] {safe(para_text)}')

# Also extract tables
for tbl in root.findall('.//w:tbl', ns):
    print('\n=== TABLE ===')
    for row in tbl.findall('.//w:tr', ns):
        row_texts = []
        for cell in row.findall('.//w:tc', ns):
            cell_texts = cell.findall('.//w:t', ns)
            cell_text = ''.join([t.text for t in cell_texts if t.text])
            row_texts.append(safe(cell_text.strip()))
        print(' | '.join(row_texts))