<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Errore 404 - Pagina non trovata</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
        }
        .container {
            text-align: center;
        }
        h1 {
            font-size: 3em;
            margin-bottom: 10px;
            color: #FF5733;
        }
        p {
            font-size: 1.2em;
            margin-top: 0;
        }
        a {
            color: #333;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            color: #FF5733;
        }
        .image-container {
            margin-top: 20px;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Errore 404</h1>
        <p>Sembra che questa pagina non esista.</p>
        <p>Vuoi <a href="/">tornare alla pagina iniziale</a>?</p>
        <div class="image-container">
            <img src="https://via.placeholder.com/400" alt="Errore 404">
        </div>
    </div>
</body>
</html>
