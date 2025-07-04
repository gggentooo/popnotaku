import json

def generate_history_json():
    out = []
    
    with open('./temp.txt', 'r') as file:
        idx = 0
        for line in file:
            idx += 1
            parsed = line.split("_")
            number = idx
            title = parsed[0]
            
            d = parsed[1].split(" ")
            d_day = d[1][:-1]
            d_year = d[2][:-2]
            match d[0][1:]:
                case "January":
                    d_month = 1
                case "February":
                    d_month = 2
                case "March":
                    d_month = 3
                case "April":
                    d_month = 4
                case "May":
                    d_month = 5
                case "June":
                    d_month = 6
                case "July":
                    d_month = 7
                case "August":
                    d_month = 8
                case "September":
                    d_month = 9
                case "October":
                    d_month = 10
                case "November":
                    d_month = 11
                case "December":
                    d_month = 12
                case _:
                    return ValueError
            
            datestring = f"{d_year}-{d_month:02d}-{d_day}"
            
            o = {
                "number": number,
                "title": title,
                "title-ko": f"팝픈뮤직 {number}",
                "release": datestring
            }
            out.append(o)
        
    outfile = open("history.json", "w", encoding='utf8')
    json.dump(out, outfile, ensure_ascii=False)

def generate_lounge_json():
    out = []
    
    with open('./temp.txt', 'r') as file:
        idx = 0
        c = []
        cont = ""
        for line in file:
            idx += 1
            
            if idx % 2 == 1:
                c = line.split(",")
                c[-1] = c[-1][:-1]
            else:
                cont = line[:-1]
                o = {
                    "char": c,
                    "content-ja": cont,
                    "content-ko": ""
                }
                out.append(o)
        
    outfile = open("temp.json", "w", encoding='utf8')
    json.dump(out, outfile, ensure_ascii=False)

def generate_history_individual_json():
    with open('../data/title/arcade_titles.json', 'r') as source:
        raw = json.load(source)
    
    for title in raw:
        num = title["number"]
        obj = {
            "number": title["number"],
            "title": title["title"],
            "title-ko": title["title-ko"],
            "release": title["release"],
            "sections": [
                
            ]
        }
        with open(f'../data/title/{num}.json', 'w') as file:
            json.dump(obj, file, ensure_ascii=False)
            
def generate_genre_strings_from_html():
    out = []
    with open('./temp.txt', 'r') as source:
        for line in source:
            if "href=" in line:
                b = line.split('a href="')[1].split('/')[0]
                if b != "" and b[0] != "#":
                    out.append(b)
    
    outfile = open('./temp.json', 'w', encoding='utf8')
    json.dump(out, outfile, ensure_ascii=False)
    
def generate_genre_strings_from_html_songnum():
    out = []
    with open('./temp.txt', 'r') as source:
        for line in source:
            if "href=" in line:
                b = line.split('a href="')[1].split('/')[1].split('.')[0]
                if b != "" and b != "web" and b != "a><" and b[0] != "#":
                    out.append(b)
    
    outfile = open('./temp.json', 'w', encoding='utf8')
    json.dump(out, outfile, ensure_ascii=False)
    
def generate_song_jsonframes(title):
    frame = {
        "version": title,
        "genre": "",
        "title": "",
        "artist": [],
        "character": "",
        "content-ja": {
            "artist-comment": "",
            "character-comment": "",
            "staff-comment": []
        },
        "content-ko": {
            "artist-comment": "",
            "character-comment": "",
            "staff-comment": []
        }
    }
    
    with open(f'../data/title/{title}.json', 'r') as source:
        raw = json.load(source)["songs"]
    
    for c in raw:
        l = c["list"]
        for s in l:
            with open(f'../data/song/{title}/{s}.json', 'w', encoding='utf8') as out:
                json.dump(frame, out, ensure_ascii=False)

def generate_songlist_0617():
    out = []
    
    songnum = 0
    idx = 0
    idnum = -1
    
    idstrings = []
    
    genrestr = ""
    titlestr = ""
    artiststr = ""
    
    with open('./tempanother.txt', 'r') as idlist:
        for line in idlist:
            idstrings.append(line.strip('\n'))
    
    with open('./temp.txt', 'r') as source:
        for line in source:
            idx += 1
            if "<tr>" in line:
                songnum += 1
                idx = 0
            if idx == 1:
                genrestr = line.split(">")[1].split("<")[0]
            if idx == 2:
                titlestr = line.split(">")[1].split("<")[0]
            if idx == 3:
                artiststr = line.split(">")[1].split("<")[0]
            if "</tr>" in line:
                idnum += 1
                if idnum >= len(idstrings):
                    break
                urlstr = idstrings[idnum]
                songobj = {
                    "id": "",
                    "genre": genrestr,
                    "title": titlestr,
                    "artist": artiststr
                }
                out.append(songobj)
    
    outfile = open('./temp2.json', 'w', encoding='utf8')
    json.dump(out, outfile, ensure_ascii=False)

def convert_18_songlist():
    obj_18 = {}
    frames = []
    
    with open('../data/title/18.json', 'r') as json_18:
        obj_18 = json.load(json_18)
    with open('./temp2.json', 'r') as fr:
        frames = json.load(fr)
    
    for cat in obj_18["songs"]:
        ls = cat["list"]
        for idx, entry in enumerate(ls):
            for f in frames:
                if f["id"] == entry:
                    entry = f
            ls[idx] = entry

    outfile = open('./temp.json', 'w', encoding='utf8')
    json.dump(obj_18, outfile, ensure_ascii=False)
    
def sift_rawdata():
    out = []
    
    with open('./data.json', 'r') as raw:
        dat = json.load(raw)
        for entry in dat:
            if entry["hardest"]:
                obj = {
                    "id": entry["sid"],
                    "title": entry["title"],
                    "fw-title": entry["fwTitle"],
                    "r-title": entry["rTitle"],
                    "genre": entry["genre"],
                    "fw-genre": entry["fwGenre"],
                    "r-genre": entry["rGenre"],
                    "artist": entry["artist"],
                    "debut": entry["debut"],
                    "slug": entry["slug"],
                    "remy": entry["remyPath"],
                    "chara": entry["rChara"]
                }
                out.append(obj)
    
    outfile = open('./data_sifted.json', 'w', encoding='utf8')
    json.dump(out, outfile, ensure_ascii=False)

def generate_song_individual_frames():
    updated_out = []
    
    with open('../data/song/all.json', 'r') as raw:
        dat = json.load(raw)
        for song in dat:
            detailfile = open(f"../data/song/detail/{song["id"]}_{song["slug"]}.json", 'r')
            entry = json.load(detailfile)
            boolbackup = entry[0]["finished-backup"]
            booltranslate = entry[0]["finished-translate"]
            obj = {
                "id": song["id"],
                "title": song["title"],
                "fw-title": song["fw-title"],
                "r-title": song["r-title"],
                "genre": song["genre"],
                "fw-genre": song["fw-genre"],
                "r-genre": song["r-genre"],
                "artist": song["artist"],
                "debut": song["debut"],
                "slug": song["slug"],
                "remy": song["remy"],
                "chara": song["chara"],
                "finished-backup": boolbackup,
                "finished-translate": booltranslate
            }
            updated_out.append(obj)
            
    outfile = open('./data_new.json', 'w', encoding='utf8')
    json.dump(updated_out, outfile, ensure_ascii=False)

def generate_chara_json():
    charalist = []
    
    with open('../data/song/all.json', 'r') as raw:
        dat = json.load(raw)
        for entry in dat:
            charaobj = None
            for chara in charalist:
                if chara["name-dat"] == entry["chara"]:
                    charaobj = chara
            if charaobj == None:
                charaobj = {
                    "name-dat": entry["chara"],
                    "name-ja": "",
                    "name-ko": "",
                    "debut": entry["debut"],
                    "songs": [entry["id"]],
                    "designer": "",
                    "profile": {
                        "description": "",
                        "from": "",
                        "hobby": "",
                        "likes": "",
                        "dislikes": ""
                    },
                    "profile-ko": {
                        "description": "",
                        "from": "",
                        "hobby": "",
                        "likes": "",
                        "dislikes": ""
                    },
                    "birthday": {
                        "month": 1,
                        "day": 1
                    },
                    "apple-color": 0,
                    "quotes": [
                        {
                            "from": "",
                            "content": "",
                            "content-ko": ""
                        }
                    ]
                }
                charalist.append(charaobj)
            else:
                charaobj["songs"].append(entry["id"])
            
    outfile = open('./chara_all.json', 'w', encoding='utf8')
    json.dump(charalist, outfile, ensure_ascii=False)

def reorder_chars():
    charalist = []
    
    with open("./raws/_characters__202506250852.json", 'r') as raw:
        dat = json.load(raw)
        for entry in dat['characters']:
            identifier = entry['chara_id'].split('_')[0]
            c_found = False
            for c in charalist:
                if c['sort_name'] == entry['sort_name']:
                    c_found = True
                    if entry['chara_id'] not in c['id_list']:
                        c['id_list'].append(entry['chara_id'])
            if c_found == False:
                newchara = {
                    'data_name': identifier,
                    'sort_name': entry['sort_name'],
                    'disp_name': entry['disp_name'],
                    'disp_name_ko': "",
                    'disp_name_en': "",
                    'id_list': [entry['chara_id']]
                }
                charalist.append(newchara)
    
    outfile = open('./chara_all_new.json', 'w', encoding='utf8')
    json.dump(charalist, outfile, ensure_ascii=False)
            
def main():
    reorder_chars()

if __name__ == "__main__":
    main()