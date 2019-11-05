# WIT-BLOG
# Assignment 1 - Agile Software Practice.

Name: Yuefeng Ju
Student ID: 20086447
## Overview.

a.	Management of Administrator: Like many popular blogs today, administrator management is the most basic. As a developer, I added the admin backend add, login feature. It is worth mentioning that I set a super password to ensure the security of the app and prevent the interface from being called. Users will be authenticated when they log in. No such user and password errors will prevent login. As a developer, I can manage users on the cloud database.
b.	Management of Category:  Users can add categories to their blogs before writing a single article. Users can add categories, and if they do not meet the character limit, they will be prompted with an error. Users can view the created categories and can specify to update their names. Finally, the user can delete the specified category.
c.	Management of Article: For the main part of the blog, the user can post the article, the tag of the article (title, body, author, date and permissions, where the permission means that the user can set the blog to be invisible to others). Users can view all articles that have been sent, or they can be categorized to find a specific article. Users can also modify the specified content including title, body and author. Of course, users can also delete the specified article.


## API endpoints.
GET/ Setup - Background login
POST/ user - Login in
POST/ category - add a new category
GET/ category - view all categories
PUT/ category - update a category
DELETE/ category - delete a category
GET/ blog - view all blogs
            search a blog by category
POST/ blog - publish a new blog
PUT/ blog - update a blog
DELETE/ blog - delete a blog



User

         √ should return login information
Category
         √ should delete category
         √ should change the title to new title and send a message
         √ should get all categories
         √ should return category added confirmation message
         
 Blog
         √ should delete blog
         √ should change the title to new title and send a message
         √ should get all blogs
         √ should return blog not added message
         √ should return blog added confirmation message 

 10 passing (4s)
