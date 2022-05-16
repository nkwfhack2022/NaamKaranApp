from textdistance import Editex

def find_similar_names(given_name, name_list):    
    similar_names = []
    for name in name_list:
        simi_met = Editex().normalized_similarity(given_name, name[1])
        if simi_met >= 0.70:
            similar_names.append(name)
            
    return similar_names

# name_list = ['Antara','Aswin','Ashwin','Ravindra','Shanti','Simon','Alex','Manoj','Thanuj','Piyush','Peyush']
# print(find_similar_names("Asween", name_list))