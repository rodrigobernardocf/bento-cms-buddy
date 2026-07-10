import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [{ title: "Admin · Dr. JP" }],
  }),
  component: PainelShell,
});

function PainelShell() {
  return (
    <>
      <div id="painel-root" />
      {/* Plain inline script — not a module, runs independently of TanStack hydration */}
      <script dangerouslySetInnerHTML={{ __html: ADMIN_SCRIPT }} />
    </>
  );
}

/* ─── All admin logic as a self-contained inline script ─────────────────
   Uses fetch() to /api/session-check and /api/admin-posts.
   Forms POST directly to /api/admin-* endpoints (no JS needed for submit).
   ──────────────────────────────────────────────────────────────────────── */
const ADMIN_SCRIPT = /* js */ `
(function() {

var root = document.getElementById('painel-root');

var css = [
  'html,body{margin:0;padding:0}',
  '#painel-root{font-family:"Helvetica Neue",Arial,sans-serif;background:#f5f3ef;color:#1a2744;min-height:100vh}',
  '.adm-layout{display:flex;min-height:100vh}',
  '.adm-sidebar{width:220px;background:#1a2744;color:#fff;padding:1.5rem;flex-shrink:0;display:flex;flex-direction:column;gap:.25rem}',
  '.adm-logo{font-size:.9rem;font-weight:700;margin-bottom:1.5rem}',
  '.adm-nav-group{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin:.75rem 0 .35rem}',
  '.adm-link{display:block;padding:.5rem .75rem;border-radius:.75rem;font-size:.875rem;font-weight:500;color:rgba(255,255,255,.7);text-decoration:none;cursor:pointer}',
  '.adm-link:hover{color:#fff;background:rgba(255,255,255,.08)}',
  '.adm-link.active{color:#fff;background:rgba(255,255,255,.12)}',
  '.adm-link.danger{color:#f87171}',
  '.adm-spacer{flex:1}',
  '.adm-main{flex:1;padding:2.5rem;overflow-y:auto}',
  '.adm-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem}',
  '.adm-title{font-size:1.625rem;font-weight:600}',
  '.adm-btn{border:none;border-radius:.875rem;padding:.6rem 1.2rem;font-size:.8rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;text-decoration:none;display:inline-block}',
  '.adm-btn-primary{background:#1a2744;color:#fff}',
  '.adm-btn-wine{background:#7a1c2e;color:#fff}',
  '.adm-btn-blue{background:#4a7ab5;color:#fff;border-radius:.75rem;padding:.45rem .9rem;font-size:.75rem}',
  '.adm-btn-ghost{background:transparent;border:1px solid #e5e1d8;color:#8a8070;border-radius:.875rem;padding:.5rem 1rem;font-size:.8rem;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}',
  '.adm-btn-danger{background:transparent;border:1px solid #fca5a5;color:#7a1c2e;border-radius:.75rem;padding:.45rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer}',
  '.adm-table{width:100%;border-collapse:collapse;background:#fff;border-radius:1rem;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}',
  '.adm-th{background:#f0ede8;padding:.75rem 1rem;text-align:left;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8a8070}',
  '.adm-td{padding:.875rem 1rem;border-top:1px solid #e5e1d8;font-size:.875rem;vertical-align:middle}',
  '.adm-badge-pub{display:inline-block;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:700;text-transform:uppercase;background:#d1fae5;color:#065f46}',
  '.adm-badge-draft{display:inline-block;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:700;text-transform:uppercase;background:#f0ede8;color:#8a8070}',
  '.adm-card{background:#fff;border:1px solid #e5e1d8;border-radius:1.25rem;padding:2rem;max-width:860px}',
  '.adm-field{margin-bottom:1.1rem}',
  '.adm-label{display:block;font-size:.8125rem;font-weight:600;margin-bottom:.4rem}',
  '.adm-input{width:100%;border:1px solid #e5e1d8;border-radius:.75rem;padding:.6rem .875rem;font-size:.9rem;font-family:inherit;background:#fff;box-sizing:border-box;outline:none}',
  '.adm-textarea{width:100%;border:1px solid #e5e1d8;border-radius:.75rem;padding:.6rem .875rem;font-size:.9rem;font-family:inherit;line-height:1.7;resize:vertical;box-sizing:border-box}',
  '.adm-select{width:100%;border:1px solid #e5e1d8;border-radius:.75rem;padding:.6rem .875rem;font-size:.9rem;font-family:inherit;background:#fff}',
  '.adm-err{background:#fef2f2;border:1px solid #fca5a5;border-radius:.75rem;padding:.75rem 1rem;font-size:.8rem;color:#7a1c2e;margin-bottom:1rem}',
  '.adm-muted{color:#8a8070;font-size:.8rem}',
  '.adm-login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}',
  '.adm-login-card{background:#fff;border:1px solid #e5e1d8;border-radius:1.5rem;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,.06)}',
  '.adm-login-title{font-size:1.5rem;font-weight:600;margin-bottom:.25rem}',
  '.adm-row-actions{display:flex;gap:.5rem;align-items:center}',
].join('\\n');

var style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

// ─── delete confirm (data-title avoids escaping nightmares) ─────────────

document.addEventListener('submit', function(e) {
  var form = e.target;
  if (form && form.classList && form.classList.contains('confirm-delete')) {
    var title = form.getAttribute('data-title') || 'este item';
    if (!confirm('Excluir "' + title + '"?')) e.preventDefault();
  }
});

// ─── helpers ────────────────────────────────────────────────────────────

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function params() {
  return new URLSearchParams(location.search);
}

// ─── loading ─────────────────────────────────────────────────────────────

root.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;color:#8a8070">Carregando...</div>';

// ─── views ───────────────────────────────────────────────────────────────

function renderLogin(error) {
  var errHtml = error
    ? '<div class="adm-err">' + esc(decodeURIComponent(error)) + '</div>'
    : '';
  root.innerHTML =
    '<div class="adm-login-wrap">' +
      '<div class="adm-login-card">' +
        '<h1 class="adm-login-title">Admin · Dr. JP</h1>' +
        '<p class="adm-muted" style="margin-bottom:1.75rem">Entre com sua conta para gerenciar o site.</p>' +
        errHtml +
        '<form method="POST" action="/api/admin-login">' +
          '<div class="adm-field"><label class="adm-label">E-mail</label>' +
            '<input class="adm-input" type="email" name="email" placeholder="seu@email.com" autocomplete="email" required></div>' +
          '<div class="adm-field"><label class="adm-label">Senha</label>' +
            '<input class="adm-input" type="password" name="password" placeholder="••••••••" autocomplete="current-password" required></div>' +
          '<button type="submit" class="adm-btn adm-btn-primary" style="width:100%">Entrar</button>' +
        '</form>' +
      '</div>' +
    '</div>';
}

function sidebarHtml(view) {
  function navLink(href, label, v) {
    var active = (view === v || (!view && v === 'posts')) ? ' active' : '';
    return '<a class="adm-link' + active + '" href="' + href + '">' + label + '</a>';
  }
  return (
    '<aside class="adm-sidebar">' +
      '<div class="adm-logo">CMS · Dr. JP</div>' +
      '<div class="adm-nav-group">Conteúdo</div>' +
      navLink('/painel', 'Posts', 'posts') +
      navLink('/painel?view=new', 'Novo post', 'new') +
      '<div class="adm-spacer"></div>' +
      '<a class="adm-link" href="/" style="color:rgba(255,255,255,.5)">← Ver site</a>' +
      '<a class="adm-link danger" href="/api/admin-logout">Sair</a>' +
    '</aside>'
  );
}

function renderPostsList(posts, error) {
  var errHtml = error
    ? '<div class="adm-err">' + esc(decodeURIComponent(error)) + '</div>'
    : '';
  var rows = posts.length === 0
    ? '<tr><td class="adm-td" colspan="4" style="text-align:center;color:#8a8070">Nenhum post ainda. <a href="/painel?view=new" style="color:#7a1c2e">Criar o primeiro →</a></td></tr>'
    : posts.map(function(p) {
        return (
          '<tr>' +
            '<td class="adm-td"><strong>' + esc(p.title) + '</strong><br>' +
              '<span class="adm-muted">' + esc(p.slug) + '</span></td>' +
            '<td class="adm-td"><span class="' + (p.status === 'published' ? 'adm-badge-pub' : 'adm-badge-draft') + '">' +
              (p.status === 'published' ? 'Publicado' : 'Rascunho') + '</span></td>' +
            '<td class="adm-td adm-muted" style="white-space:nowrap">' + fmtDate(p.published_at || p.created_at) + '</td>' +
            '<td class="adm-td">' +
              '<div class="adm-row-actions">' +
                '<a class="adm-btn adm-btn-blue" href="/painel?view=edit&id=' + esc(p.id) + '">Editar</a>' +
                '<a class="adm-btn adm-btn-ghost" href="/blog/' + esc(p.slug) + '" target="_blank" rel="noreferrer" style="font-size:.75rem">Ver</a>' +
                '<form class="confirm-delete" data-title="' + esc(p.title) + '" method="POST" action="/api/admin-delete-post" style="display:inline">' +
                  '<input type="hidden" name="id" value="' + esc(p.id) + '">' +
                  '<button type="submit" class="adm-btn-danger">Excluir</button>' +
                '</form>' +
              '</div>' +
            '</td>' +
          '</tr>'
        );
      }).join('');

  root.innerHTML =
    '<div class="adm-layout">' +
      sidebarHtml('posts') +
      '<main class="adm-main">' +
        '<div class="adm-header">' +
          '<h1 class="adm-title">Posts</h1>' +
          '<a class="adm-btn adm-btn-wine" href="/painel?view=new">+ Novo post</a>' +
        '</div>' +
        errHtml +
        '<table class="adm-table">' +
          '<thead><tr>' +
            '<th class="adm-th">Título</th>' +
            '<th class="adm-th">Status</th>' +
            '<th class="adm-th">Data</th>' +
            '<th class="adm-th"></th>' +
          '</tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</main>' +
    '</div>';
}

function renderPostForm(post, error) {
  var isEdit = !!post;
  var view = isEdit ? 'edit' : 'new';
  var errHtml = error
    ? '<div class="adm-err">' + esc(decodeURIComponent(error)) + '</div>'
    : '';
  root.innerHTML =
    '<div class="adm-layout">' +
      sidebarHtml(view) +
      '<main class="adm-main">' +
        '<div class="adm-header">' +
          '<h1 class="adm-title">' + (isEdit ? 'Editar post' : 'Novo post') + '</h1>' +
          '<a class="adm-btn adm-btn-ghost" href="/painel">← Voltar</a>' +
        '</div>' +
        errHtml +
        '<div class="adm-card">' +
          '<form method="POST" action="/api/admin-save-post">' +
            (isEdit ? '<input type="hidden" name="id" value="' + esc(post.id) + '">' : '') +
            '<div class="adm-field"><label class="adm-label">Título</label>' +
              '<input class="adm-input" type="text" name="title" value="' + esc(post ? post.title : '') + '" placeholder="Título do artigo" required></div>' +
            '<div class="adm-field"><label class="adm-label">Resumo (excerpt)</label>' +
              '<textarea class="adm-textarea" name="excerpt" rows="2" placeholder="Frase de abertura — aparece na listagem e no header do post">' + esc(post && post.excerpt ? post.excerpt : '') + '</textarea></div>' +
            '<div class="adm-field"><label class="adm-label">Conteúdo (parágrafos separados por linha em branco)</label>' +
              '<textarea class="adm-textarea" name="content" rows="22" placeholder="Escreva o artigo aqui.\n\nSepare os parágrafos com uma linha em branco.">' + esc(post && post.content ? post.content : '') + '</textarea></div>' +
            '<div class="adm-field"><label class="adm-label">URL da imagem de capa</label>' +
              '<input class="adm-input" type="url" name="image" value="' + esc(post && post.featured_image_url ? post.featured_image_url : '') + '" placeholder="https://..."></div>' +
            '<div class="adm-field"><label class="adm-label">Status</label>' +
              '<select class="adm-select" name="status">' +
                '<option value="draft"' + (!post || post.status !== 'published' ? ' selected' : '') + '>Rascunho</option>' +
                '<option value="published"' + (post && post.status === 'published' ? ' selected' : '') + '>Publicado</option>' +
              '</select></div>' +
            '<div style="display:flex;gap:.75rem;margin-top:.5rem">' +
              '<button type="submit" class="adm-btn adm-btn-primary">' + (isEdit ? 'Salvar alterações' : 'Criar post') + '</button>' +
              '<a class="adm-btn adm-btn-ghost" href="/painel">Cancelar</a>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</main>' +
    '</div>';
}

// ─── main ─────────────────────────────────────────────────────────────────

(async function() {
  var p = params();
  var view = p.get('view') || 'posts';
  var id   = p.get('id');
  var error = p.get('error');

  // Check auth
  var session;
  try {
    var r = await fetch('/api/session-check');
    session = await r.json();
  } catch(e) {
    session = { authed: false };
  }

  if (!session.authed) {
    renderLogin(error);
    return;
  }

  // Fetch posts (used for list + finding the post to edit)
  var postsData;
  try {
    var pr = await fetch('/api/admin-posts');
    postsData = await pr.json();
  } catch(e) {
    postsData = { posts: [] };
  }

  var posts = postsData.posts || [];

  if (view === 'new') {
    renderPostForm(null, error);
  } else if (view === 'edit' && id) {
    var post = posts.find(function(p) { return p.id === id; });
    renderPostForm(post || null, error);
  } else {
    renderPostsList(posts, error);
  }
})();

})();
`;
