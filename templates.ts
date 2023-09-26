const _if = (condition: unknown, template: string) => (
  condition ? template : ''
);

const Tabs = () => `
  <input type="radio" name="tabs" id="tab1" class="tab-input" checked />
  <label for="tab1">editor</label>
  <input type="radio" name="tabs" id="tab2" class="tab-input" />
  <label for="tab2">preview</label>
  <small id="characterCount"></small>
`;

const Editor = (paste = '') => `
  <div class="tab tab-editor">
    <textarea id="paste" name="paste" required>${paste}</textarea>
    <div id="editor"></div>
  </div>

  <div id="preview" class="tab tab-preview">
  </div>
`;

const layout = (content: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="pastebin" >
    <link rel="stylesheet" href="/codemirror.min.css">
    <link rel="stylesheet" href="/main.css">
    <title>
      pastebin
    </title>
  </head>
  <body>
    ${content}
  </body>
  </html>
`;

export const homePage = ({
  paste = '',
  url = '',
  errors = { url: '' },
} = {}) => layout(`
  <main>
    ${Tabs()}

    <form id="editor-form" method="post" action="/save">
      ${Editor(paste)}

      <div class="flex gap-1 my1">
        <input
          name="url"
          type="text"
          placeholder="custom url"
          minlength="3"
          maxlength="40"
          value="${url}"
          pattern=".*\\S+.*"
          aria-invalid="${Boolean(errors.url)}"
          ${_if(errors.url, 'aria-describedby="url-error"')}
        />
        <input
          name="editcode"
          type="text"
          placeholder="optional edit code"
          minlength="3"
          maxlength="40"
        />
        ${_if(errors.url, `
          <strong id="url-error">${errors.url}</strong>
        `)}
      </div>

      <div class="button-group">
        <button type="submit">
          save
        </button>
      </div>
    </form>
  </main>
  <script src="/marked.min.js"></script>
  <script src="/codemirror.min.js"></script>
  <script src="/cm-markdown.min.js"></script>
  <script src="/cm-sublime.min.js"></script>
  <script src="/editor.js"></script>
`);

export const pastePage = ({ id = '', html = '' } = {}) => layout(`
  <main>
    <div class="paste">
      ${html}
    </div>
    <div class="button-group">
      <a class="btn" href="/${id}/edit">edit</a>
      <a class="btn" href="/${id}/delete">delete</a>
    </div>
  </main>
`);

export const editPage = (
  { id = '', paste = '', hasEditCode = false, errors = { editCode: '' } } = {},
) => layout(`
  <main>
    ${Tabs()}

    <form id="editor-form" method="post" action="/${id}/save">
      ${Editor(paste)}

      <div class="flex gap-1 my1">
        <input class="display-none" name="url" type="text" value="${id}" disabled />

        ${_if(hasEditCode, `
          <input
            name="editcode"
            type="text"
            placeholder="edit code"
            minlength="3"
            maxlength="40"
            required
            aria-invalid="${Boolean(errors.editCode)}"
            ${_if(errors.editCode, 'aria-describedby="editcode-error"')}
          />
        `)}

        ${_if(errors.editCode, `
          <strong id="editcode-error">${errors.editCode}</strong>
        `)}
      </div>

      <div class="button-group">
        <button type="submit">
          save
        </button>
      </div>
    </form>
  </main>
  <script src="/marked.min.js"></script>
  <script src="/codemirror.min.js"></script>
  <script src="/cm-markdown.min.js"></script>
  <script src="/cm-sublime.min.js"></script>
  <script src="/editor.js"></script>
`);

export const deletePage = (
  { id = '', hasEditCode = false, errors = { editCode: '' } } = {}
) => layout(`
  <main>
    <div>
      <em>are you sure you want to delete this paste?</em>
      <strong>${id}</strong>
    </div>
    <form method="post" action="/${id}/delete">
      ${_if(hasEditCode, `
        <input
          name="editcode"
          type="text"
          placeholder="edit code"
          minlength="3"
          maxlength="40"
          required
          aria-invalid="${Boolean(errors.editCode)}"
          ${_if(errors.editCode, 'aria-describedby="editcode-error"')}
        />

        ${_if(errors.editCode, `
          <strong id="editcode-error">${errors.editCode}</strong>
        `)}
      `)}

      <div class="button-group">
        <button type="submit">
          delete
        </button>

        <a class="btn" href="/${id}">
          cancel
        </a>
      </div>
    </form>
  </main>
`);

export const errorPage = () => layout(`
  <p>404</p>
`);
