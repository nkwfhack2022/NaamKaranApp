from textdistance import Editex
class NameSimilarity:
    def matchName(self, given_name, comparable):
        return Editex().normalized_similarity(given_name, comparable)


e = NameSimilarity()
print('Enter a desired name: ')
given_name = input()
name_list = ['Antara','Aswin','Ashwin','Ravindra','Shanti','Simon','Alex','Manoj','Thanuj','Piyush','Peyush']
similar_names = []
for name in name_list:
    simi_met = e.matchName(given_name, name)

    if simi_met >= 0.80:
        similar_names.append(name)
        
print(similar_names)
