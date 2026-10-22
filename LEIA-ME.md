# Wallford · LP Grupo VIP

Página única em HTML, CSS e JavaScript puro, sem bibliotecas e sem dependências externas. Fontes e imagens já estão dentro do pacote.

## Estrutura

```text
index.html     a página
css/style.css  todo o visual (cores e espaçamentos em variáveis no :root)
js/main.js     link dos botões, carrossel, faixa animada, barra fixa no celular e animações de entrada
images/        fotos (webp), logo, favicon e imagem de compartilhamento
fonts/         Instrument Serif e Instrument Sans (Google Fonts, licença OFL)
```

Para publicar, envie a pasta inteira mantendo a estrutura. Abrir o `index.html` direto no navegador também funciona.

## Seções

Faixa superior, hero, faixa animada, coleção (carrossel com 8 modelos), A assinatura Wallford, Acesso privilegiado (bento grid com os benefícios do grupo), Feito para ser percebido, Uma escolha bem acompanhada, fechamento e rodapé. No celular, uma barra fixa com o botão aparece depois que o botão do topo sai da tela.

## Link dos botões

Todos os botões levam ao grupo do WhatsApp. Para trocar o link, altere `LINK_GRUPO` no início do `js/main.js` (se quiser acrescentar UTMs, preencha o objeto `UTM` logo abaixo). Para funcionar mesmo sem JavaScript, troque também os `href` dos botões no `index.html`.

Link atual: `https://chat.whatsapp.com/JYrf16nmzNQALrfnWntqYt?s=sw&p=i&mlu=4&ilr=4`

## Google Tag Manager

Container `GTM-MRRCNHDV` já instalado: o script no início do `<head>` e o `noscript` logo após a abertura do `<body>`.

## Pendências

- Pixel Meta: pode ser configurado pelo GTM ou colado no `<head>`, onde está o comentário `PREENCHER`. Os botões já disparam `fbq('track', 'Lead')` quando o pixel existir.
- Endereço canônico (`canonical`) no domínio final.
- A imagem de compartilhamento (`og:image`) está com caminho relativo. Troque pela URL completa quando a página estiver no domínio final.
