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

def main():
    generate_lounge_json()

if __name__ == "__main__":
    main()