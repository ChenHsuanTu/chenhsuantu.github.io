class Money:
    rates={'USD':1.0/30.0,'HKD':1.0/4.0,'GBP':1.0/40.0,'NTD':1.0/1.0}
    def __init__(self,currency,value):
        self.currency=currency
        self.value=value
    def __repr__(self):
        return '[{} ${:.2f}]'.format(self.currency,self.value)
    def __add__(self,q):
        new_value=self.value+q.convalueert(self.currency).value
        return Money(self.currency,new_value)
    def __sub__(self,q):
        new_value=self.value-q.convalueert(self.currency).value
        return Money(self.currency,new_value)
    def convalueert(self,currency):
        new_value=(self.value*self.rates[currency])/self.rates[self.currency]
        return Money(currency,new_value)
    