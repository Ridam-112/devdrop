const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../components/tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx'));

console.log(`Found ${files.length} tool components to clean...`);

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let code = fs.readFileSync(filePath, 'utf-8');

  // Replace prominent simulation phrases
  code = code.replace(/LAUNCH SIMULATION/g, 'RUN SECURITY AUDIT');
  code = code.replace(/EXECUTE SIMULATION/g, 'EXECUTE AUDIT PROTOCOL');
  code = code.replace(/START SIMULATION/g, 'START INSPECTION');
  code = code.replace(/SIMULATION TERMINATED/g, 'AUDIT COMPLETE');
  code = code.replace(/SIMULATION COMPLETE/g, 'OPERATION COMPLETED');
  code = code.replace(/SIMULATION FINISHED/g, 'PROCESS FINISHED');
  code = code.replace(/SIMULATION RESULTS?/g, 'AUDIT RESULTS');
  code = code.replace(/SIMULATION CYCLE/g, 'INSPECTION CYCLE');
  code = code.replace(/Simulated/g, 'Target');
  code = code.replace(/simulated/g, 'active');
  code = code.replace(/\bSIMULATED\b/g, 'CONFIRMED');
  code = code.replace(/SIMULATION/g, 'SYSTEM');
  code = code.replace(/Simulation/g, 'Diagnostic');
  code = code.replace(/simulation/g, 'diagnostic');
  code = code.replace(/Prank/g, 'Protocol');
  code = code.replace(/prank/g, 'tool');
  code = code.replace(/Fake/g, '');
  code = code.replace(/fake/g, '');

  // Remove visible bottom disclaimer disclaimers inside tool result cards
  code = code.replace(/<p className="text-\[11px\] font-mono text-slate-400[^"]*">[\s\S]*?\*[\s\S]*?<\/p>/g, '');
  code = code.replace(/<div className="text-\[11px\] font-mono text-slate-400 border-t[^"]*">[\s\S]*?⚠️[\s\S]*?<\/div>/g, '');
  code = code.replace(/<div className="text-center text-xs font-mono text-slate-400 border-t[^"]*">[\s\S]*?⚠️[\s\S]*?<\/div>/g, '');
  code = code.replace(/FOR ENTERTAINMENT PURPOSES ONLY/g, 'AUTHORIZED ACCESS ONLY');

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Cleaned ${file}`);
});

console.log("All components in components/tools/ successfully cleaned!");
