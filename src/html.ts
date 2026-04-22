export function wrapHtml(title: string, body: string): string {
    return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body>
<article data-pagefind-body>
${body}
</article>
</body>
</html>`;
}