const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// URLs do site
const links = [
  { url: '/', changefreq: 'monthly', priority: 1.0 },
  { url: '/#servicos', changefreq: 'monthly', priority: 0.8 },
  { url: '/#portfolio', changefreq: 'monthly', priority: 0.8 },
  { url: '/#faq', changefreq: 'monthly', priority: 0.7 },
  { url: '/#apoio', changefreq: 'monthly', priority: 0.7 },
  { url: '/#contato', changefreq: 'monthly', priority: 0.8 }
];

// Função para gerar o sitemap
async function generateSitemap() {
  try {
    const stream = new SitemapStream({ hostname: 'https://leandrobonuzzi.com.br' });
    
    // Adiciona cada URL ao stream
    links.forEach(link => {
      stream.write({
        url: link.url,
        changefreq: link.changefreq,
        priority: link.priority,
        lastmod: new Date().toISOString()
      });
    });

    // Finaliza o stream
    stream.end();

    // Converte o stream em uma string XML
    const sitemap = await streamToPromise(Readable.from(stream)).then(data => data.toString());

    // Salva o sitemap no arquivo
    require('fs').writeFileSync('./public/sitemap.xml', sitemap);
    
    console.log('Sitemap gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
  }
}

// Executa a função
generateSitemap(); 