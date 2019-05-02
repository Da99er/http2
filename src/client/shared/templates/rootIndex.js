const {
    RELOAD_FILES_STORAGE,
} = global.MY1_GLOBAL;

exports.START = () => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="shortcut icon" type="image/gif" src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" >
<link rel="preload" href="${RELOAD_FILES_STORAGE['index.js']}" as="script">
<link rel="preload" href="${RELOAD_FILES_STORAGE['index.css']}" as="style">
<link rel="stylesheet" href="${RELOAD_FILES_STORAGE['index.css']}" />
<title>Page</title>
</head>
<body >
<div id="root">`;

exports.END = (preloadData) => `</div>
<script>window._preloadData=${JSON.stringify(preloadData)}</script>
<script src="${RELOAD_FILES_STORAGE['index.js']}"></script>
</body></html>`;
