export const paperTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; background: white; color: black; }
    .break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
  </style>
</head>
<body class="bg-white text-black text-base leading-relaxed">
  <div class="mb-8 border-b-2 border-black pb-4 text-center">
    <h1 class="text-2xl font-bold uppercase tracking-widest">{{title}}</h1>
    <p class="text-sm font-semibold mt-2">Subject: {{subject}} | Duration: {{durationMinutes}} mins | Max Marks: {{totalMarks}}</p>
  </div>

  {{#if instructions}}
  <div class="mb-8 p-4 border border-black break-inside-avoid">
    <h3 class="font-bold underline mb-2">General Instructions:</h3>
    <ul class="list-disc pl-5 space-y-1 text-sm">
      {{#each instructions}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  {{/if}}

  <div class="w-full border border-black p-4 mb-8 flex justify-between text-sm uppercase tracking-wider font-bold">
    <span>Student Name: ___________________________</span>
    <span>Roll Number: _________________</span>
    <span>Section: _______</span>
  </div>

  <main class="space-y-12">
    {{{sectionsHtml}}}
  </main>
</body>
</html>
`;
