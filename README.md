# DEN Coffee Shop — Endterm Project

DEN Coffee Shop is a five-page café website for Astana. This version extends the [group's midterm repository](https://github.com/namantai/midterm-DEN-Coffee-Shop). It keeps the original Home, Menu, About, Gallery and Contact pages, the shared navigation, coffee photos, responsive layout, Bootstrap carousel and five original drink prices.

## Group

| Member | GitHub |
| --- | --- |
| Nurtas Amantay | [namantai](https://github.com/namantai) |
| Dauren Tilek | [DaurenTilek](https://github.com/DaurenTilek) |
| Erasyl | [madiulyerasyl](https://github.com/madiulyerasyl) |

## Run the site

Extract the complete project, then open `index.html` in a current browser. The pages use relative paths. Bootstrap 5.3.6, jQuery 3.6.1 and all photographs are inside `assets/`. The site runs offline with no package installation or build step.

## Features and manual tests

| Where | Try this | Expected result |
| --- | --- | --- |
| Menu → carousel | Click Next, then Previous. | The second group of photos appears, then the original group returns. |
| Menu → Coffee Prices | Enter `latte`, choose Iced, then enter `tea`. | The table shows two lattes, then one iced latte, then a message about no matches. |
| Menu → Sort by | Clear the search, choose All drinks, then sort by price or name. | Iced Latte appears first by descending price, Americano first alphabetically, and Espresso first in Menu order. |
| Menu → Drink estimate | Add Espresso once and Iced Latte twice. Click the minus button for Iced Latte. | The first total is 4,500 ₸. Removing one iced latte changes it to 2,700 ₸. Removing all cups clears the list and returns the total to 0 ₸. |
| About → Before your visit | Open the question about cold coffee and follow its menu link. | The answer expands and the link takes you to the drink prices. |
| Gallery | Open the first photo, press the left arrow, click Next and press Escape. | The viewer wraps to photo 6, then photo 1. Escape closes it and returns focus to the first thumbnail. |
| Contact | Click Check message with all fields empty. Try `guest@` as the email. | Each empty field gets its own error. The name field receives focus first. The email field explains how to correct its format. |
| Contact | Enter `Demo Guest`, `guest@example.com`, choose Feedback and enter `I like the iced latte.` | Checking the form shows a success message. Editing a field clears the previous success. |

The estimate is held in memory for the current page. The contact form validates input in the browser. It does not place an order, send email or save personal details.
