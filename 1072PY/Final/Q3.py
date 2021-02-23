from bs4 import BeautifulSoup 
import urllib.request

rec=[]

url='http://web.chfd.gov.tw/current_case.php'
html_string=urllib.request.urlopen(url).read()
html = BeautifulSoup(html_string, 'html.parser')

table= html.find_all('table')[0]
trs=table.find_all('tr')

for i in range(len(trs)):
    s=''
    for td in trs[i].find_all('th' if i==0 else 'td'):
        s=s+','+td.text.strip()
    rec.append(s[1:])

with open("fire.csv","w",encoding="big5") as fp:
    for i in range(len(rec)):fp.write(rec[i]+(''if i==len(rec)-1 else'\n'))

for i in rec: print(i)