import fs from "fs";
import path from "path";

const filePath = path.resolve(
  "node_modules/whatsapp-web.js/src/util/Injected/Store.js"
);

try {
  if (!fs.existsSync(filePath)) {
    console.log("⚠ No se encontró Store.js en la ruta esperada.");
    process.exit(0);
  }

  let content = fs.readFileSync(filePath, "utf8");
  let lines = content.split("\n");
  let modified = false;

  // ==========================================================
  // 1) FIX: Comentar LID Migration
  // ==========================================================

  const lidKeyword = "Lid1X1MigrationUtils.isLidMigrated";

  const updatedLines = lines.map(line => {
    if (line.includes(lidKeyword) && !line.trim().startsWith("//")) {
      modified = true;
      return "//" + line; // Comentar la línea
    }
    return line;
  });

  content = updatedLines.join("\n");

  // ==========================================================
  // 2) FIX: Restaurar Store.getChat()
  // ==========================================================

  const getChatFix = `
/* ======== FIX WHATSAPP: restaurar getChat ======== */
if (!window.Store.getChat) {
    window.Store.getChat = function (id) {
        return (
            window.Store.Chat._find(id) ||
            window.Store.Chat.get(id) ||
            window.Store.Chat._get(id)
        );
    };
}
/* ======== END FIX WHATSAPP ======== */
`;

  if (!content.includes("FIX WHATSAPP: restaurar getChat")) {
    // Insertamos el fix justo después del primer "window.Store"
    content = content.replace(
      /window\.Store[\s\S]*?=/,
      match => match + "\n" + getChatFix + "\n"
    );

    modified = true;
  }

  // ==========================================================

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✔ Fixes aplicados correctamente a whatsapp-web.js");
  } else {
    console.log("ℹ Los fixes ya estaban aplicados.");
  }
} catch (error) {
  console.error("Error aplicando el fix:", error);
}
