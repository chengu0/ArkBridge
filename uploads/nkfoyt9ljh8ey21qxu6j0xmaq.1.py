import time
import random
list1=[random.randint(1,10000) for i in range(1000)]
tuple1=tuple(list1)
set1=set(list1)
key=[i for i in range(1000)]
dict1=dict(zip(key,list1))
print(list1)
print(tuple1)

start=time.time()
list1.insert(3, "test")
print("在中间插入元素：", list1)
print("长度为：", len(list1))
list1.remove("test")
if "test" in list1:
    print("yes")
else:
    print("no")
list1.sort()    
end=time.time()
print(end-start)



start=time.time()
if 550 in tuple1:
    print("yes")
else:    
    print("no")
#tuple 不能增删改查排
end=time.time()
print(end-start)

start=time.time()
dict1[4]=50
print("增加元素后:", dict1)  
# 修改键值对  
dict1['banana'] = 5  
print("修改元素后:", dict1)  

# 查询键  
if '600' in dict1:  
    print("查询结果: 600 的值为", dict1['orange'])  

# 删除键值对  
del dict1[976]  
print("删除元素后:", dict1)  
end=time.time()
print(end-start)


start=time.time()
set1 = {'apple', 'banana', 'orange'}  

# 增加元素  
set1.add('grape')  
print("增加元素后:", set1)  

# 查询元素  
if 'banana' in set1:  
    print("查询结果: banana 存在于集合中")  
else:  
    print("查询结果: banana 不存在于集合中")  

# 删除元素  
set1.remove('banana')  # 如果元素不存在，会抛出 KeyError  
print("删除元素后:", set1) 
end=time.time()
print(end-start)



