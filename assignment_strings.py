# -*- coding: utf-8 -*-
"""Assignment_Strings.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1qzZ3CkW3Dl-DuHp0ef-Q9t_eHGkEe8nY
"""

#Write a Python program to count the number of characters in a string without using len function.

def char(var):
  count=0
  for i in var:
    count=count+1
  return count
var=str(input('Enter the word: '))
c=char(var)
print(f'{c} charcters persent in word')

#Write a Python program to reverse a string without using [::-1]
def rev(a):
  new_str=''
  for i in range(len(a)-1,-1,-1):
    new_str=new_str+a[i]
  return new_str
a=str(input('Enter the word: '))
res=rev(a)
print(res)

#Write a Python program to check if a string is a palindrome don't use [::-1].
if res == a:
  print(f'{res} is a palindrome')
else:
  print(f'{res} is not a palindrome')

#Write a Python program to find the most common character in a string
def com(x):
  global y
  y={}
  for i in x:
    if i in y:
      y[i]=y[i]+1
    else:
      y[i]=1
  most_common=max(y,key=y.get)
  return(most_common)

x=str(input('Enter a string : '))
v=com(x)
print(f'The most common charcter is {v} because it is repetaed {y[v]}')

#Write a Python program to check if two strings are anagrams.
def ana(l,m):
  u=sorted(l.lower())
  v=sorted(m.lower())
  if u==v:
    return 'Both are anagrams'
  else:
    return 'Both are not anagrams'
l=str(input('Enter the First word :'))
m=str(input('Enter the Second word: '))
print(ana(l,m))

#Write a Python program to remove all the vowels from a string.
def remove_vowels(w):
  vowels=['a','e','i','o','u','A','E','I','O','U']
  v=[]
  for i in w:
    if i in vowels:
      pass
    else:
      v.append(i)
  return ' '.join(v)
w=str(input('Enter the String: '))
u=remove_vowels(w)
print(f'After rmoveing Vowels :{u}')

#Write a Python program to find the longest word in a string.
def longest_word(k):
  l=k.split()
  long_word=''
  for i in l:
    if len(i) > len(long_word):
      long_word=i
  return long_word

k=input("Enter the sentence : ")
a=longest_word(k)
print(f'The longest Word is :{a}')

# Write a Python program to capitalize the first letter of each word in a string [dont use built-in-function title].
def cap(r):
  q=r.split()
  for i in q:
    print(str(i).capitalize(),end=" ")

r=input('Enter the Sentence: ')
cap(r)

# Write a Python program to find the frequency of each character in a string.
def frequency_char(a):
  fre={}
  for i in a:
    if i in fre:
      fre[i]=fre[i]+1
    else:
      fre[i]=1
  return fre

a=input('Enter the string: ')
z=frequency_char(a)
print(f'the frequency of each character is: {z}')

#write a python programme to find the sum of all the even characters based on Ascii values
def sum_even(j):
  sum=0
  for i in j:
    if ord(i)%2 == 0:
      sum=sum+ord(i)
  return sum


j=input('Enter the Charcter: ')
o=sum_even(j)
print(f'The sum of all even numbers is : {o}')