# DEN Coffee Shop

DEN Coffee Shop is a responsive five-page café website for Astana. This final project continues the existing midterm/endterm site and keeps its Home, Menu, About, Gallery, Contact, Bootstrap carousel, gallery viewer, contact validation, FAQ, price list, menu filters, and drink estimate.

## Project links

- Source repository: https://github.com/namantai/midterm-DEN-Coffee-Shop
- Deployment: Not published as part of this project update. No live site URL is claimed.

## Run locally

1. Download or extract the complete project folder.
2. Open `index.html` in a current browser. There is no build step or package installation.
3. Open `menu.html` to use the menu tools and live weather panel. Internet access is needed for the weather API; the other site features work locally.

## Final stage features

- **Live API data:** `assets/js/weather.js` uses `fetch()` and async/await to request current Astana weather from the public Open-Meteo Forecast API. It shows loading, success, empty-data and error/retry states, and renders returned JSON with DOM elements. No API key is required. API documentation: https://open-meteo.com/en/docs.
- **Object-oriented JavaScript:** `assets/js/menu.js` defines a `Drink` class with properties and a price method, then creates five drink objects used by the live menu.
- **Persistent estimate:** the drink estimate saves to `localStorage` as JSON and restores on the next visit. Missing, malformed, or inaccessible storage is handled safely.
- **Advanced menu search:** search by drink name, filter hot/iced drinks, and sort by menu order, price, or name. The result count and no-match state update as the controls change.
- **Coffee Notes CRUD:** create, view, edit, and delete tasting notes. Notes are kept in browser `localStorage`; form fields are validated and user text is rendered safely as text.
- **Theme preference:** switch the Menu page between light and dark themes; the selected preference is stored safely and restored on return.
- **Responsive and accessible UI:** semantic labels, live status announcements, keyboard-focus handling for the estimate, responsive layouts, and a retry action for API errors.

## API and storage

The API request is made by the browser to `https://api.open-meteo.com/v1/forecast` for coordinates in Astana and current temperature, humidity, and weather code. The service is public and does not require a secret key. Network failures are shown in the page and can be retried.

Browser storage keys are `denCoffeeEstimate.v1`, `denCoffeeNotes.v1`, and `denCoffeeTheme.v1`. Stored data stays in the current browser profile and is not sent to a server. Clearing browser site data removes these saved estimates, notes, and theme preference.

## Group and contributions

The existing project README lists the following group members:

| Member | GitHub |
| --- | --- |
| Nurtas Amantay | [namantai](https://github.com/namantai) |
| Dauren Tilek | [DaurenTilek](https://github.com/DaurenTilek) |
| Erasyl | [madiulyerasyl](https://github.com/madiulyerasyl) |

Individual contribution details were not provided with this update. Each group member should add a short, accurate description of their own work here before submission; no contribution claims have been assigned on their behalf.

## Manual verification

| Page | Action | Expected result |
| --- | --- | --- |
| Home | Navigate through the main links and open View Menu. | All original pages remain reachable. |
| Menu | Wait for weather, then use Try again after disconnecting the network or blocking the request. | Weather shows loading, current conditions on success, or a readable error and retry action. |
| Menu | Switch to dark theme, reload, then switch back. | Theme changes consistently and the selected preference is restored after reload. |
| Menu | Search `latte`, choose Iced, then search `tea`. | Two lattes appear, then one iced latte, then a no-match message. |
| Menu | Clear search, choose All drinks, and sort by price or name. | Iced Latte sorts first by price; Americano sorts first alphabetically. |
| Menu | Add Espresso and two Iced Lattes, then refresh the page. | The total is 4,500 ₸ and the same estimate is restored after refresh. Remove a cup; the total updates and persists. |
| Menu | Add a tasting note, edit it, refresh the page, and delete it. | Each CRUD action updates the list; the note remains after refresh and disappears after deletion. |
| About | Open a visit FAQ item and follow its menu link. | The answer expands and the link navigates to menu prices. |
| Gallery | Open a photo, use arrow keys and close with Escape. | The viewer changes photos and returns focus to the thumbnail when closed. |
| Contact | Submit empty fields, then try `guest@`. | Required-field and email-format validation messages appear. |
| Contact | Submit valid sample data. | The form shows its local success confirmation; it does not send email or place an order. |

## Deployment

This project update has not been published to GitHub Pages, Netlify, or another host. To deploy, publish the project root as a static site and then replace the deployment status above with the verified live URL. The repository URL above points to the source repository and is not a deployment URL.
