export const buildSchemaEnforcer = (schemaString: string, exampleString?: string): string => {
  let output = \`
[JSON SCHEMA ENFORCEMENT]
Your output MUST adhere EXACTLY to the following TypeScript structure:

\${schemaString}
\`.trim();

  if (exampleString) {
    output += \`\\n\\n[EXAMPLE VALID OUTPUT]\\n\${exampleString}\`;
  }

  return output;
};
