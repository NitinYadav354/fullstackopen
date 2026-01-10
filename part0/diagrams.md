## 0.4
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a note and clicks "Save"

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server

    Note left of server: Server reads form data and adds a new note to notes array
    
    server-->>browser: 302 Redirect to /notes
    deactivate server

    Note right of browser: Browser follows redirect automatically

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    Note right of browser: Browser executes JS, which fetches JSON

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: JSON [{ "content": "...", "date": "..." }, ...]
    deactivate server

    Note right of browser: Browser renders updated notes list using DOM
```

## 0.5
```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```


## 0.6 
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a note and clicks "Save"
    Note right of browser: JavaScript intercepts the submit and updates the list on the page

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa (JSON)
    activate server
    Note left of server: Server reads JSON body and adds a new note to notes array
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: Browser stays on /spa and shows the updated notes list using DOM
```
