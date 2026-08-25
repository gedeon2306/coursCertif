sequenceDiagram
    participant browser
    participant server

    Note right of browser: The user writes a note and clicks the submit button

    Note right of browser: The JS code prevents the default form submission,<br/>creates a new note, adds it to the local list,<br/>rerenders the notes on the page (DOM-API),<br/>and sends the new note to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note over server: The server saves the new note object
    server-->>browser: HTTP status code 201 Created {"message":"note created"}
    deactivate server