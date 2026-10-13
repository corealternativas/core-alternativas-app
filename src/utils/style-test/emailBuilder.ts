import { esc, driveToEmbedUrl } from "./emailHelpers";
import { estilos, arquetipos, imgUrls } from "./styleData";

interface EmailOptions {
  logoUrl?: string;
  brandPrimary?: string;
  brandText?: string;
  mutedBg?: string;
  senderName?: string;
  ctaUrl?: string;
  ctaLabel?: string;
}

/**
 * Creates HTML for a style cell (one column)
 */
function styleCellHTML(
  styleKey: string | null | undefined,
  arquetiposMap: typeof arquetipos,
  estilosMap: typeof estilos,
  imgUrlsMap: typeof imgUrls,
  brandText: string
): string {
  if (!styleKey) {
    return `<td style="width:50%;padding:0 8px 16px 8px;"></td>`;
  }
  const label = arquetiposMap[styleKey as keyof typeof arquetipos] || styleKey;
  const href = estilosMap[styleKey as keyof typeof estilos] || "#";
  const img = driveToEmbedUrl(imgUrlsMap[styleKey as keyof typeof imgUrls] || "");

  return `
    <td style="width:50%;padding:0 8px 16px 8px;vertical-align:top;">
      <div style="display:inline-block;background:#EFF7F1;border:1px solid #D7EBDD;color:${brandText};
                  font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;
                  border-radius:999px;padding:6px 10px;margin:0 0 8px 0;">
        ${esc(label)}
      </div>
      <a href="${esc(href)}" target="_blank" style="text-decoration:none;border:0;display:block;">
        <img src="${esc(img)}" alt="${esc(label)}"
             style="display:block;border:0;outline:none;text-decoration:none;width:100%;height:auto;">
      </a>
    </td>`;
}

/**
 * Creates a two-column grid HTML table
 */
function twoColumnGridHTML(
  keys: string[],
  arquetiposMap: typeof arquetipos,
  estilosMap: typeof estilos,
  imgUrlsMap: typeof imgUrls,
  brandText: string
): string {
  let out =
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">';
  for (let i = 0; i < keys.length; i += 2) {
    const left = keys[i];
    const right = keys[i + 1] || null;
    out += `<tr>
      ${styleCellHTML(left, arquetiposMap, estilosMap, imgUrlsMap, brandText)}
      ${styleCellHTML(right, arquetiposMap, estilosMap, imgUrlsMap, brandText)}
    </tr>`;
  }
  out += "</table>";
  return out;
}

/**
 * Builds the complete HTML email with 2 columns
 */
export function buildCoreEmailHtml_2cols(
  name: string,
  matchingStyles: string[],
  ownDescription: string,
  opts?: EmailOptions
): string {
  const {
    logoUrl = "https://images.squarespace-cdn.com/content/v1/6446be01262fb84cd63a5732/2fe1ed1b-7026-40c5-b12f-f332de4b6bae/logo+vertical-09.png?format=1500w",
    brandPrimary = "#1F7A5B",
    brandText = "#122B26",
    mutedBg = "#F3F5F3",
    senderName = "Equipo CORE Alternativas",
    ctaUrl = "https://www.corealternativas.com/estilismo-personalizado",
    ctaLabel = "Reservar asesoría",
  } = opts || {};

  const grid =
    matchingStyles && matchingStyles.length
      ? twoColumnGridHTML(matchingStyles, arquetipos, estilos, imgUrls, brandText)
      : '<p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;">No se encontraron arquetipos para mostrar.</p>';

  const greeting = name && name.trim()
    ? `Hola ${esc(name)}!`
    : "¡Hola!";

  return `<!doctype html>
<html lang="es"><head>
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta charset="utf-8"><title>Resultados de tu test</title>
</head>
<body style="margin:0;padding:0;background:${mutedBg};">
<center style="width:100%;background:${mutedBg};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%"
       style="max-width:720px;background:#ffffff;margin:0 auto;">
  <!-- header -->
  <tr>
    <td style="padding:24px 24px 0 24px;text-align:left;">
      <img src="${esc(logoUrl)}" alt="CORE Alternativas Conscientes" width="120"
           style="display:block;border:0;outline:none;text-decoration:none;">
    </td>
  </tr>

  <!-- intro -->
  <tr>
    <td style="padding:16px 24px 0 24px;font-family:Arial, Helvetica, sans-serif;">
      <p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;color:#111827;">${greeting}</p>
      <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#111827;">Gracias por hacer el test de estilo personal ✨</p>
      <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#111827;">
        <strong>Recordá:</strong> tu estilo no es fijo, evoluciona con vos. Somos personas multidimensionales y
        <em>nuestro estilo refleja esas mil historias.</em>
      </p>
      <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#111827;">
        En CORE definimos 10 arquetipos de estilo. Según lo que elegiste (<strong>${esc(ownDescription)}</strong>),
        tu estilo combina varios de ellos:
      </p>
      <p style="margin:0 0 8px 0;font-size:13px;line-height:1.6;color:#475467;">
        (<em>Hacé click ✨ en las imágenes para ver más</em>).
      </p>
    </td>
  </tr>

  <!-- grid 2 columnas -->
  <tr>
    <td style="padding:0 24px 0 24px;">
      ${grid}
    </td>
  </tr>

  <!-- ¿QUÉ TE PARECIÓ? -->
  <tr>
    <td style="padding:8px 24px 0 24px;font-family:Arial, Helvetica, sans-serif;">
      <p style="margin:0 0 6px 0;font-size:14px;letter-spacing:.3px;color:${brandText};font-weight:800;">¿QUÉ TE PARECIÓ?</p>
      <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#111827;">
        Ojalá te hayas visto representada en los arquetipos que seleccionaste. Si aparecieron arquetipos que no te parecen tan cercanos a tu estilo actual, quizá sean un estilo nuevo a explorar que puede representar una arista de tu personalidad de una forma nueva.
      </p>
    </td>
  </tr>

  <!-- ¿CÓMO LO APLICO? -->
  <tr>
    <td style="padding:8px 24px 0 24px;font-family:Arial, Helvetica, sans-serif;">
      <p style="margin:0 0 6px 0;font-size:14px;letter-spacing:.3px;color:${brandText};font-weight:800;">¿CÓMO LO APLICO?</p>
      <ul style="margin:0 0 12px 20px;padding:0;font-size:15px;line-height:1.6;color:#111827;">
        <li>Revisar tu guardarropas para identificar cómo podés armar los looks sugeridos con lo que ya tenés (<em>te sorprenderías</em>).</li>
        <li>Comparar con las sugerencias y entender si faltan algunas piezas claves. Priorizar compras responsables.</li>
        <li>Circular las prendas que no responden a cómo te querés presentar hoy (evitemos la fatiga visual de tener demasiadas prendas y no usarlas frecuentemente).</li>
      </ul>
    </td>
  </tr>

  <!-- ayuda + CTA -->
  <tr>
    <td style="padding:8px 24px 8px 24px;font-family:Arial, Helvetica, sans-serif;">
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#111827;">
        Si te gustaría tener ayuda para aplicar las sugerencias, también ofrecemos asesorías personalizadas.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" style="margin:4px 0 10px 0;">
        <tr>
          <td bgcolor="${brandPrimary}" style="border-radius:999px;">
            <a href="${esc(ctaUrl)}" target="_blank"
               style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.2;color:#ffffff;text-decoration:none;font-weight:700;">
              ${esc(ctaLabel)}
            </a>
          </td>
        </tr>
      </table>
      <br>
      <br>
      <br>
      <p style="margin:12px 0 0 0;font-size:15px;line-height:1.6;color:#111827;">
        Un abrazo,<br><strong>${esc(senderName)}</strong>
      </p>
    </td>
  </tr>

  <!-- pie -->
  <tr>
    <td style="padding:16px 24px 24px 24px;border-top:1px solid #eee;">
      <p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">
        Recibís este correo porque completaste el test de estilos de CORE Alternativas.
      </p>
    </td>
  </tr>
</table>
</center>
</body></html>`;
}

export function buildCoreEmailHtml_suggestion(
  name: string,
  opts?: EmailOptions
): string {
  const {
    logoUrl = "https://images.squarespace-cdn.com/content/v1/6446be01262fb84cd63a5732/2fe1ed1b-7026-40c5-b12f-f332de4b6bae/logo+vertical-09.png?format=1500w",
    brandText = "#122B26",
    mutedBg = "#F3F5F3",
    senderName = "Equipo CORE Alternativas",
  } = opts || {};

  const greeting = name && name.trim() ? `Hola ${esc(name)}!` : "¡Hola!";

  return `<!doctype html>
<html lang="es"><head>
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta charset="utf-8"><title>Gracias por tu sugerencia</title>
</head>
<body style="margin:0;padding:0;background:${mutedBg};">
<center style="width:100%;background:${mutedBg};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%"
       style="max-width:720px;background:#ffffff;margin:0 auto;">
  <tr>
    <td style="padding:24px 24px 0 24px;text-align:left;">
      <img src="${esc(logoUrl)}" alt="CORE Alternativas Conscientes" width="120"
           style="display:block;border:0;outline:none;text-decoration:none;">
    </td>
  </tr>

  <tr>
    <td style="padding:16px 24px 24px 24px;font-family:Arial, Helvetica, sans-serif;">
      <p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;color:${brandText};">${greeting}</p>
      <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#111827;">
        Gracias por tus sugerencias. Te invitamos a volver a intentar el test más adelante.
      </p>
      <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:#111827;">
        Un abrazo,<br><strong>${esc(senderName)}</strong>
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding:16px 24px 24px 24px;border-top:1px solid #eee;">
      <p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">
        Recibís este correo porque completaste el test de estilos de CORE Alternativas.
      </p>
    </td>
  </tr>
</table>
</center>
</body></html>`;
}
