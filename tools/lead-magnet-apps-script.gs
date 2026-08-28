// Backend for the audit-your-repo.html lead-magnet form (writing/audit.js).
// Deploy in Google Apps Script (script.google.com) as a Web App:
//   Execute as: Me · Who has access: Anyone
// Paste the resulting /exec URL into SCRIPT_URL in writing/audit.js.
//
// Reference copy only — the live logic runs inside Google's infrastructure,
// not from this repo. Keep this in sync manually when you edit the deployed
// version.

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Sheet1'; // change if you renamed the tab

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const name = (data.name || '').toString().trim();
  const email = (data.email || '').toString().trim();
  const problem = (data.problem || '').toString().trim();

  SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
    .appendRow([new Date(), name, email, problem]);

  sendLeadMagnetEmail(name, email, problem);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendLeadMagnetEmail(name, email, problem) {
  const firstName = name.split(' ')[0] || 'there';
  const subject = 'Your wont-scale audit — install it in one line';

  const plainBody = [
    'Hi ' + firstName + ',',
    '',
    "Here's everything you need to audit your repo against the ten reasons vibe-coded apps don't scale.",
    '',
    '— QUICK INSTALL —',
    'curl -fsSL https://github.com/papaonlegs/wont-scale/releases/latest/download/install.sh | sh',
    '',
    'Prefer to read it first (you should):',
    'curl -fsSL https://github.com/papaonlegs/wont-scale/releases/latest/download/install.sh -o install.sh',
    'less install.sh',
    'sh install.sh /path/to/your-app',
    '',
    '— CLAUDE CODE PLUGIN —',
    '/plugin marketplace add papaonlegs/wont-scale',
    '/plugin install wont-scale@wont-scale',
    '/first-audit',
    '',
    '— PLAIN TERMINAL WIZARD (no AI required) —',
    'git clone https://github.com/papaonlegs/wont-scale.git',
    'cd wont-scale && npm install',
    'node dist/first-audit.js /path/to/your-app',
    '',
    '— OR JUST READ IT —',
    'https://github.com/papaonlegs/wont-scale',
    '',
    (problem ? 'You mentioned: "' + problem + '" — ' : '') +
      "if you'd rather have a second pair of eyes on it directly, reply to this email or book a call: https://calendly.com/papaonlegs/30min",
    '',
    '— Farouk'
  ].join('\n');

  const fg = '#1a1a1a', muted = '#666', rule = '#ddd', bg = '#fafafa';
  const fontStack = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const mono = "'SF Mono',Menlo,Consolas,monospace";

  function codeBlock(lines) {
    return '<div style="background:#fff;border:1px solid ' + rule + ';border-radius:8px;' +
      'padding:12px 14px;margin:0 0 18px;font-family:' + mono + ';font-size:13px;' +
      'line-height:1.6;color:' + fg + ';white-space:pre-wrap;word-break:break-all;">' +
      lines.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</div>';
  }
  function h3(text) {
    return '<div style="font-size:15px;font-weight:600;color:' + fg + ';margin:0 0 8px;">' + text + '</div>';
  }
  function p(html) {
    return '<p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:' + fg + ';">' + html + '</p>';
  }

  const followUp = (problem
    ? 'You mentioned: &ldquo;' + problem.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '&rdquo; &mdash; if '
    : "If ") +
    "you'd rather have a second pair of eyes on it directly, just reply to this email, or:";

  const htmlBody =
    '<div style="background:' + bg + ';padding:32px 16px;">' +
    '<div style="max-width:520px;margin:0 auto;font-family:' + fontStack + ';">' +

    '<div style="font-size:13px;color:' + muted + ';margin:0 0 24px;">' +
      '<a href="https://papa.onle.gs" style="color:' + muted + ';text-decoration:none;">papa.onle.gs</a>' +
    '</div>' +

    '<h1 style="font-size:22px;font-weight:600;letter-spacing:-0.01em;color:' + fg + ';margin:0 0 20px;">' +
      'Your wont-scale audit' +
    '</h1>' +

    p('Hi ' + firstName.replace(/&/g, '&amp;').replace(/</g, '&lt;') + ',') +
    p("Here's everything you need to audit your repo against the ten reasons vibe-coded apps don&rsquo;t scale.") +

    h3('Quick install') +
    p('One command — detects your stack and your AI CLI, drives it through the ten reasons, writes the report.') +
    codeBlock('curl -fsSL https://github.com/papaonlegs/wont-scale/releases/latest/download/install.sh | sh') +

    h3('Claude Code plugin') +
    codeBlock('/plugin marketplace add papaonlegs/wont-scale\n/plugin install wont-scale@wont-scale\n/first-audit') +

    h3('Plain terminal wizard') +
    p('No AI required.') +
    codeBlock('git clone https://github.com/papaonlegs/wont-scale.git\ncd wont-scale && npm install\nnode dist/first-audit.js /path/to/your-app') +

    h3('Or just read it') +
    p('<a href="https://github.com/papaonlegs/wont-scale" style="color:' + fg + ';border-bottom:2px solid ' + fg + ';text-decoration:none;">github.com/papaonlegs/wont-scale</a>') +

    '<div style="border-top:1px solid ' + rule + ';margin:28px 0 24px;"></div>' +

    p(followUp) +

    '<div style="margin:0 0 28px;">' +
      '<a href="https://calendly.com/papaonlegs/30min" style="display:inline-block;padding:10px 18px;' +
      'border:1px solid ' + fg + ';border-radius:6px;color:' + fg + ';text-decoration:none;' +
      'font-size:14px;font-weight:500;">Book a call</a>' +
    '</div>' +

    '<div style="font-size:13px;color:' + muted + ';">&mdash; Farouk</div>' +

    '</div>' +
    '</div>';

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: 'Farouk Umar'
  });
}
