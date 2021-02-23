import myclass
a=myclass.Money('GBP',100)-myclass.Money('HKD',100)+myclass.Money('USD',100)
print(a.convert('NTD'))