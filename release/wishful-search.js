!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.WishfulSearch=t():e.WishfulSearch=t()}(self,(()=>(()=>{"use strict";var e={99:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.paginateRawResults=t.detectType=t.addColumnTypes=void 0;const r=n(683);function o(e,t){const n=e.map((e=>e.columns.filter((e=>!!e.statsColumnType)))).flat().find((e=>e.name===t));if(n)return n.statsColumnType;const o=r.VALID_PRIMITIVE_TYPES.find((e=>t.toLowerCase().startsWith(e)));return o?{type:o}:t.toLowerCase().startsWith("currency")?{type:"currency",code:t.slice(8,11).toUpperCase()}:{type:"unknown"}}t.addColumnTypes=function(e,t){return e&&e.rawResults&&e.rawResults.length&&(e.rawResults=e.rawResults.map((e=>(e.columns&&e.columns.length&&(e.columnTypes=e.columns.map((e=>o(t,e)))),e)))),e},t.detectType=o,t.paginateRawResults=function(e,t=200,n=1){return e.map((e=>{const r=(n-1)*t,o=Math.min(e.values.length,r+t);return{columns:e.columns,columnTypes:e.columnTypes,values:e.values.slice(r,o),rowsPerPage:t,page:n,totalRows:e.values.length}}))}},173:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.generateAutoSearchMessages=void 0;const r=n(683),o=(e,t)=>`The user had this USER_QUESTION: ${e}\n\nWe tried the following modified questions, and got these queries and results:\n\n${t.map(((e,t)=>` - ${t+1}: "${e.question}" generated "${e.query}" which returned ${e.results.count} results with top prettified result "${e.results.topResultStr}". ${e.suitabilityDesc?`Suitability was ${e.suitabilityScore} (${e.suitabilityDesc}`:""}`)).join("\n")}\n\nWe can improve the results by looking for ways to increase suitability. Check for patterns (like consistent no resutls, same result over again, etc). Return your analysis following this typespec, and be exhaustive and thorough.\n\n'''typescript\n${r.AnalysisTypespec}\n\`\`\`\n\nValid JSON:`;t.generateAutoSearchMessages=function(e,t,n){return[{content:(r=e,`You can only return valid JSON.\n\nInformation is stored in tables with this schema:\n\`\`\`\n${r}\n\`\`\``),role:"system"},{content:o(t,n),role:"user"}];var r}},509:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,s){function i(e){try{l(r.next(e))}catch(e){s(e)}}function a(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}l((r=r.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.LLMSearcheableDatabase=void 0;const s=o(n(470));class i{static create(e,t,n,o,a){return r(this,void 0,void 0,(function*(){const r={locateFile:a?()=>a:void 0},l=yield(0,s.default)(r),c=new l.Database;return c.run(e),new i(c,l,e,t,n,o)}))}constructor(e,t,n,r,o,s){if(this.sqljsSQL=t,this.strDDL=n,this.dbname=r,this.key=o,this.objectToTabledRow=s,this.db=e,this.tableNames=this.getTableNames(),!this.tableNames.includes(o.table))throw new Error(`Primary table ${o.table} not found in database`);this.tableNames=[o.table,...this.tableNames.filter((e=>e!==o.table))]}getTableNames(){const e=this.db.exec('SELECT name FROM sqlite_master WHERE type="table"');if(!e||!e.length||!e[0])throw new Error("No tables found in database");return e[0].values.flat()}getEnums(e,t=!1){const n=t?`SELECT ${e.column}, COUNT(${e.column}) as frequency\n    FROM ${e.table}\n    GROUP BY ${e.column}\n    ORDER BY frequency DESC;`:`SELECT DISTINCT ${e.column} FROM ${e.table}`,r=this.db.exec(n);return r.length&&r[0]?t?r[0].values.map((e=>e[0])):r[0].values.flat():[]}rawQuery(e){const t=["INSERT","UPDATE","DELETE","CREATE","ALTER","DROP","PRAGMA","BEGIN","COMMIT","ROLLBACK","REPLACE"];e=e.split(";")[0].trim();for(const n of t)if(e.toUpperCase().includes(n))throw new Error(`Query must not have ${n}`);if(!e.toUpperCase().startsWith("SELECT"))throw new Error("Raw Query to db must start with SELECT");if(-1!==e.indexOf(";"))throw new Error("Raw Query to db must be a single statement");const n=this.db.exec(e);return n.length&&n[0]?n[0].values.flat():[]}complexQuery(e){if(!(e=e.split(";")[0].trim()).toUpperCase().startsWith("SELECT"))throw new Error("Raw Query to db must start with SELECT");if(-1!==e.indexOf(";"))throw new Error("Raw Query to db must be a single statement");const t=this.db.exec(e);return t.length&&t[0]?t:[]}getColumnCount(e){const t=this.db.exec(`SELECT COUNT(*) FROM pragma_table_info('${e}')`);if(!t||!t.length||!t[0])throw new Error("Tried to get columns on invalid db");return t[0].values[0][0]}delete(e){const t=e.map((e=>"?")).join(","),n=`DELETE FROM ${this.key.table} WHERE ${this.key.column} IN (${t})`;this.db.run(n,e)}insert(e,t=!1){const n=e.map((e=>this.objectToTabledRow(e))),r=n.filter((e=>e.length===this.tableNames.length));if(r.length!==n.length&&t)throw new Error(n.length-r.length+" rows do not match the number of columns in the table.");const o=[];for(const e of n)for(let n=0;n<this.tableNames.length;n++){const r=this.tableNames[n],s=this.getColumnCount(r),i=`INSERT OR IGNORE INTO ${r} VALUES (${Array(s).fill("?").join(",")})`,a=this.db.prepare(i);try{this.db.run("BEGIN"),e[n].forEach((e=>{try{a.bind(e),a.step()}catch(r){if(t)throw new Error(`Error running "${i}" inserting row ${JSON.stringify(e,null,2)} - ${r}`);o.push({index:n,error:r})}})),this.db.run("COMMIT")}catch(t){throw"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Error inserting in table ",r,", row",JSON.stringify(e,null,2),t),this.db.run("ROLLBACK"),t}}return o}clearDb(){this.db.close(),this.db=new this.sqljsSQL.Database,this.db.run(this.strDDL)}}t.LLMSearcheableDatabase=i},54:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||r(t,e,n)},s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.LLMAdapters=t.WishfulSearchEngine=void 0;var i=n(322);Object.defineProperty(t,"WishfulSearchEngine",{enumerable:!0,get:function(){return i.WishfulSearchEngine}});var a=n(738);Object.defineProperty(t,"LLMAdapters",{enumerable:!0,get:function(){return s(a).default}}),o(n(683),t)},842:function(e,t){var n=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,s){function i(e){try{l(r.next(e))}catch(e){s(e)}}function a(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}l((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.fixJSON=void 0;const r="You can only return valid JSON.",o=(e,t)=>`\nError: ${e}\n\nFix this invalid JSON and return perfectly valid JSON without changing any content:\n\n'''json\n${t}\n'''\n`,s=[{invalidJSONStr:'type Analysis = {\n  suitabilityDesc: "The top result included a layover which does not match a direct flight.",\n  suitability: 0.3,\n  desires: ["A non-stop flight", "No layovers"],\n}',error:"Uncaught SyntaxError: Unexpected token 'y', \"type Analys\"... is not valid JSON",fixedJSONStr:'{\n  "suitabilityDesc": "The top result included a layover which does not match a direct flight.",\n  "suitability": 0.3,\n  "desires": ["A non-stop flight", "No layovers"],\n}'},{invalidJSONStr:"{abc:2}",error:"Uncaught SyntaxError: Expected property name or '}' in JSON at position 1",fixedJSONStr:'{"abc":2}'}];t.fixJSON=function(e,t){return n(this,void 0,void 0,(function*(){try{return JSON.parse(t)}catch(n){const i=[{content:r,role:"system"}];for(const e of s)i.push({content:o(e.error,e.invalidJSONStr),role:"user"}),i.push({role:"assistant",content:e.fixedJSONStr});i.push({role:"user",content:o(n.toString(),t)});const a=yield e(i);return a?JSON.parse(a):null}}))}},738:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,s){function i(e){try{l(r.next(e))}catch(e){s(e)}}function a(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}l((r=r.apply(e,t||[])).next())}))},o=this&&this.__asyncValues||function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,n=e[Symbol.asyncIterator];return n?n.call(e):(e="function"==typeof __values?__values(e):e[Symbol.iterator](),t={},r("next"),r("throw"),r("return"),t[Symbol.asyncIterator]=function(){return this},t);function r(n){t[n]=e[n]&&function(t){return new Promise((function(r,o){!function(e,t,n,r){Promise.resolve(r).then((function(t){e({value:t,done:n})}),t)}(r,o,(t=e[n](t)).done,t.value)}))}}};Object.defineProperty(t,"__esModule",{value:!0}),t.getLMStudioAdapter=t.getOllamaAdapter=t.getTogetherAIAdapter=void 0;const s=n(934),i=n(141),a=n(501);function l(e){const t="mistralai/Mixtral-8x7B-Instruct-v0.1";return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(n,s){var i,l,c,u,h,d,y,f;return r(this,void 0,void 0,(function*(){s&&"assistant"!==n[n.length-1].role&&n.push({role:"assistant",content:s}),"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(h=null==e?void 0:e.model)&&void 0!==h?h:t} on TogetherAI...`);const r=yield(0,a.callTogetherAI)(n,null!==(d=null==e?void 0:e.model)&&void 0!==d?d:t,null!==(y=null==e?void 0:e.temperature)&&void 0!==y?y:.5,null!==(f=null==e?void 0:e.max_tokens)&&void 0!==f?f:1e4);"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");const p=process.hrtime();let m=0;try{for(var g,v=!0,S=o(r);g=yield S.next(),!(i=g.done);v=!0){u=g.value,v=!1;const e=u;if("token"===e.type&&("yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write(e.token),m+=e.token.length),"error"===e.type&&"yes"===process.env.PRINT_WS_INTERNALS&&console.error(e.error),"completeMessage"===e.type){const t=process.hrtime(p);return"yes"===process.env.PRINT_WS_INTERNALS&&console.log("\nCharacters per second: ",m/(t[0]+t[1]/1e9)),e.message}}}catch(e){l={error:e}}finally{try{v||i||!(c=S.return)||(yield c.call(S))}finally{if(l)throw l.error}}return null}))}}}function c(e){const t="mistral";return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(n,a){var l,c,u,h,d,y,f;return r(this,void 0,void 0,(function*(){a&&"assistant"!==n[n.length-1].role&&n.push({role:"assistant",content:a});const{prompt:r,stopSequences:p}=s.LLMTemplateFunctions.mistral(n);"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(d=null==e?void 0:e.model)&&void 0!==d?d:t} on Ollama...`);const m=yield(0,i.callOllama)(r,null!==(y=null==e?void 0:e.model)&&void 0!==y?y:t,11434,null!==(f=null==e?void 0:e.temperature)&&void 0!==f?f:0);"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");const g=process.hrtime();let v=0;try{for(var S,b=!0,E=o(m);S=yield E.next(),!(l=S.done);b=!0){h=S.value,b=!1;const e=h;if("completeMessage"===e.type)return"yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write(e.message.split(p[0])[0]||"<NO TOKEN RECEIVED>"),v+=e.message.length,e.message.split(p[0])[0]||null}}catch(e){c={error:e}}finally{try{b||l||!(u=E.return)||(yield u.call(E))}finally{if(c)throw c.error}}const w=process.hrtime(g);return"yes"===process.env.PRINT_WS_INTERNALS&&console.log("\nCharacters per second: ",v/(w[0]+w[1]/1e9)),null}))}}}function u(e,t,n){const i={model:"mistral",temperature:0};return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(a,l){var c,u,h,d,y,f,p,m,g,v,S,b,E;return r(this,void 0,void 0,(function*(){l&&"assistant"!==a[a.length-1].role&&a.push({role:"assistant",content:l});const{prompt:r,stopSequences:w}=s.LLMTemplateFunctions[t](a);try{"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(y=null==n?void 0:n.model)&&void 0!==y?y:i.model} on your machine (LMStudio)...`);const t=yield e.chat.completions.create(Object.assign(Object.assign({messages:[{role:"user",content:r}]},Object.assign(Object.assign({},i),n||{})),{stop:w,stream:!0}));let s="";"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");const a=process.hrtime();let l=0;try{for(var L,T=!0,N=o(t);L=yield N.next(),!(c=L.done);T=!0){d=L.value,T=!1;const e=d;"yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write((null===(p=null===(f=e.choices[0])||void 0===f?void 0:f.delta)||void 0===p?void 0:p.content)||""),s+=(null===(g=null===(m=e.choices[0])||void 0===m?void 0:m.delta)||void 0===g?void 0:g.content)||"",(null===(S=null===(v=e.choices[0])||void 0===v?void 0:v.delta)||void 0===S?void 0:S.content)&&(l+=null===(E=null===(b=e.choices[0])||void 0===b?void 0:b.delta)||void 0===E?void 0:E.content.length)}}catch(e){u={error:e}}finally{try{T||c||!(h=N.return)||(yield h.call(N))}finally{if(u)throw u.error}}const _=process.hrtime(a);return"yes"===process.env.PRINT_WS_INTERNALS&&console.log("\nCharacters per second: ",l/(_[0]+_[1]/1e9)),s||null}catch(e){return console.error(`Error retrieving response from model ${n}`),console.error(e),null}}))}}}t.getTogetherAIAdapter=l,t.getOllamaAdapter=c,t.getLMStudioAdapter=u;const h={getOpenAIAdapter:function(e,t){const n={model:"gpt-3.5-turbo",temperature:0};return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(s,i){var a,l,c,u,h,d,y,f,p,m,g,v,S;return r(this,void 0,void 0,(function*(){if(s.length<1||!s[s.length-1])return null;if("assistant"===s[s.length-1].role){const e=s[s.length-1].content;(s=[...s.slice(0,s.length-1)])[s.length-1].content=`${s[s.length-1].content}\n\n${e}`}try{"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(h=null==t?void 0:t.model)&&void 0!==h?h:n.model} (OpenAI)...`);const E=yield e.chat.completions.create(Object.assign(Object.assign({messages:s},Object.assign(Object.assign({},n),t||{})),{stream:!0}));let w="";"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");const L=process.hrtime();let T=0;try{for(var r,i=!0,b=o(E);r=yield b.next(),!(a=r.done);i=!0){u=r.value,i=!1;const e=u;"yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write((null===(y=null===(d=e.choices[0])||void 0===d?void 0:d.delta)||void 0===y?void 0:y.content)||""),w+=(null===(p=null===(f=e.choices[0])||void 0===f?void 0:f.delta)||void 0===p?void 0:p.content)||"",(null===(g=null===(m=e.choices[0])||void 0===m?void 0:m.delta)||void 0===g?void 0:g.content)&&(T+=null===(S=null===(v=e.choices[0])||void 0===v?void 0:v.delta)||void 0===S?void 0:S.content.length)}}catch(e){l={error:e}}finally{try{i||a||!(c=b.return)||(yield c.call(b))}finally{if(l)throw l.error}}const N=process.hrtime(L);return"yes"===process.env.PRINT_WS_INTERNALS&&console.log("\nCharacters per second: ",T/(N[0]+N[1]/1e9)),w||null}catch(e){return console.error(`Error retrieving response from model ${t}`),console.error(e),null}}))}}},getClaudeAdapter:function(e,t,n,s){const i={model:"claude-2",temperature:0};return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(a,l){var c,u,h,d,y;return r(this,void 0,void 0,(function*(){let r=a.map((n=>"user"===n.role?`${e} ${n.content}`:"assistant"===n.role?`${t} ${n.content}`:`${e} <system>${n.content}</system>`)).join("");"assistant"!==a[a.length-1].role&&(r+=`${t}${l?` ${l}`:""}`);try{"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(y=null==s?void 0:s.model)&&void 0!==y?y:i.model} (Anthropic)...\n`);const e=yield n.completions.create(Object.assign(Object.assign({prompt:r,max_tokens_to_sample:1e4},Object.assign(Object.assign({},i),s||{})),{stream:!0}));let t="";"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");const a=process.hrtime();let l=0;try{for(var f,p=!0,m=o(e);f=yield m.next(),!(c=f.done);p=!0){d=f.value,p=!1;const e=d;"yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write(e.completion||""),t+=e.completion||"",e.completion&&(l+=e.completion.length)}}catch(e){u={error:e}}finally{try{p||c||!(h=m.return)||(yield h.call(m))}finally{if(u)throw u.error}}const g=process.hrtime(a);return"yes"===process.env.PRINT_WS_INTERNALS&&console.log("\nCharacters per second: ",l/(g[0]+g[1]/1e9)),t||null}catch(e){return console.error(`Error retrieving response from model ${s}`),console.error(e),null}}))}}},getOllamaAdapter:c,getLMStudioAdapter:u,getTogetherAIAdapter:l};t.default=h},934:(e,t)=>{function n(e){return{prompt:e.map(((t,n)=>"assistant"===t.role?`${t.content}${n<e.length-1?"</s>":""}`:`${n>0&&"assistant"!==e[n-1].role?"":"<s>"}[INST] ${"system"===t.role?`<system>${t.content}</system>`:t.content} [/INST]`)).join(" "),stopSequences:["</s>","<s>"]}}Object.defineProperty(t,"__esModule",{value:!0}),t.generateMistralPrompt=t.LLMTemplateFunctions=void 0,t.LLMTemplateFunctions={mistral:n,dolphin:function(e){let t=e.map(((t,n)=>"system"===t.role?`<|im_start|>system\n${t.content}<|im_end|>`:"user"===t.role?`<|im_start|>user\n${t.content}<|im_end|>`:`<|im_start|>assistant\n${t.content}${n<e.length-1?"<|im_end|>":""}`)).join("\n");return"assistant"!==e[e.length-1].role&&(t+="\n<|im_start|>assistant"),{prompt:t,stopSequences:["<|im_end|>","<|im_start|>"]}},"yarn-mistral":function(e){let t=e.map(((t,n)=>"system"===t.role||"user"===t.role?`### Instruction: ${t.content}\n`:`### Response: ${t.content}${n<e.length-1?"\n":""}`)).join("\n");return"assistant"!==e[e.length-1].role&&(t+="\n### Response: "),{prompt:t,stopSequences:["###"]}}},t.generateMistralPrompt=n},964:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.generateLLMMessages=t.searchPrompt=t.HISTORY_RESET_COMMAND=void 0,t.HISTORY_RESET_COMMAND="Ignore all previous filters. ";const n=[{factStr:"Do not use LIMIT, DISTINCT, ARRAY_LENGTH, MAX, MIN or AVG if possible.",type:"search"},{factStr:"Dont LIMIT queries.",type:"analytics"},{factStr:"Dont modify original column names from the tables if possible.",type:"analytics"},{factStr:"When creating new columns, always use one of the following prefixes:\n- for monetary fields, prefix currencyXXX to the column name, where XXX is the currency code, e.g. currencyUSD\n- otherwise prefix str, int, float, date, bool, enum, or json to the column name, .e.g. intAverage\n",type:"analytics"},{factStr:"Try and find the right rows that can help the answer.",type:"search"},{factStr:"Prefer `strftime` to format dates better.",type:"all"},{factStr:"**Deliberately go through the question and database schema word by word** to appropriately answer the question.",type:"all"},{factStr:"Prefer sorting the right values to the top instead of filters if possible.",type:"all"},{factStr:"Use LIKE instead of equality to compare strings.",type:"all"},{factStr:"Try to continue the partial query if one is provided.",type:"all"}];t.searchPrompt={system:(e,t,r)=>`You are a SQLite SQL generator that helps users answer questions from the tables provided. Here are the table definitions:\n\nDATABASE_DDL:\n\`\`\`sql\n${e}\n\`\`\`\n\n${t?`Today's date: ${t}.`:""}\n\nRULES:\n"""\n${n.filter((e=>!r||"all"===e.type||e.type===r)).map(((e,t)=>`${t+1}. ${e.factStr}`)).join("\n")}\n"""\n\n${"search"===r?"Provide an appropriate SQLite Query to return the keys to answer the user's question. Only filter by the things the user asked for, and only return ids or keys.":"Provide an appropriate SQLite query to return the answer to the user's question. Add any fields that would be helpful to explain the result but not too many."}`,user:(e,n)=>`${n?t.HISTORY_RESET_COMMAND:""}${e}`,assistant:(e,t)=>`${t} ${e}`,reflection:(e,t)=>`The query ran into the following issue:\n  """\n  ${e}\n  """\n\n  Fix and provide only the new query. SQL only, in code blocks. The query must start with ${t}.`},t.generateLLMMessages=function(e,n,r,o,s,i,a){const l=a?(new Date).toLocaleDateString():void 0,c=[];if(c.push({role:"system",content:t.searchPrompt.system(e,l,s)}),i)for(const{question:e,partialQuery:n}of i)c.push({role:"user",content:t.searchPrompt.user(e,!1)}),c.push({role:"assistant",content:t.searchPrompt.assistant(n,r)});if(o)for(const{question:e,partialQuery:n}of o)c.push({role:"user",content:t.searchPrompt.user(e,!1)}),c.push({role:"assistant",content:t.searchPrompt.assistant(n,r)});return c.push({role:"user",content:t.searchPrompt.user(n,!(o.length>0))}),!(null==i?void 0:i.length)&&r&&c.push({role:"assistant",content:r}),c}},141:function(e,t){var n=this&&this.__await||function(e){return this instanceof n?(this.v=e,this):new n(e)},r=this&&this.__asyncGenerator||function(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,s=r.apply(e,t||[]),i=[];return o={},a("next"),a("throw"),a("return"),o[Symbol.asyncIterator]=function(){return this},o;function a(e){s[e]&&(o[e]=function(t){return new Promise((function(n,r){i.push([e,t,n,r])>1||l(e,t)}))})}function l(e,t){try{(r=s[e](t)).value instanceof n?Promise.resolve(r.value.v).then(c,u):h(i[0][2],r)}catch(e){h(i[0][3],e)}var r}function c(e){l("next",e)}function u(e){l("throw",e)}function h(e,t){e(t),i.shift(),i.length&&l(i[0][0],i[0][1])}};Object.defineProperty(t,"__esModule",{value:!0}),t.callOllama=void 0,t.callOllama=function(e,t,o=11434,s=0){return r(this,arguments,(function*(){const r=JSON.stringify({model:t,template:e,options:{temperature:s}}),i=yield n(fetch(`http://127.0.0.1:${o}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:r}));if(!i.ok)throw new Error(`Ollama fetch failed with status: ${i.status}`);{const e=i.body.getReader();let t="",r="";for(;;){const{done:o,value:s}=yield n(e.read());if(o)break;for(t+=(new TextDecoder).decode(s);;){const e=t.indexOf("{"),o=t.indexOf("}");if(-1===e||-1===o)break;{const s=t.slice(e,o+1);try{const e=JSON.parse(s);if(!e.model)throw new Error("Unrecognized response from ollama - missing model field");if(e.response&&(yield yield n({type:"token",token:e.response}),r+=e.response),e.done||-1!==r.indexOf("</s>"))return yield yield n({type:"completeMessage",message:r}),yield n(void 0);t=t.slice(o+1)}catch(e){throw console.error("Error parsing Ollama response object - ",s),e}}}}}}))}},322:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,s){function i(e){try{l(r.next(e))}catch(e){s(e)}}function a(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}l((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.WishfulSearchEngine=void 0;const o=n(99),s=n(173),i=n(509),a=n(842),l=n(964),c=n(175),u=n(683);class h{static create(e,t,n,o,s,a,l,u=!0,d=!0,y=!1,f){return r(this,void 0,void 0,(function*(){(0,c.validateStructuredDDL)(t);const r=yield i.LLMSearcheableDatabase.create((0,c.generateSQLDDL)(t,!0),e,n,o,f);return new h(r,e,t,n,s,a,l,u,d,y)}))}constructor(e,t,n,r,o,s,i,a,l,c){this.name=t,this.tables=n,this.primaryKey=r,this.llmConfig=o,this.getKeyFromObject=i,this.saveHistory=a,this.enableDynamicEnums=l,this.sortEnumsByFrequency=c,this.history=[],this.db=e,this.latestIncompleteQuestion=null,this.elementDict=i?{}:null,this.callLLM=s}getQueryPrefix(e=!1){return e?"SELECT ":`SELECT ${this.primaryKey.column} FROM ${this.primaryKey.table}`}computeEnums(){if(this.enableDynamicEnums)for(const e of this.tables)for(const t of e.columns.filter((e=>void 0!==e.dynamicEnumSettings))){const n=this.db.getEnums({table:e.name,column:t.name},this.sortEnumsByFrequency),r=t.dynamicEnumSettings;if("EXHAUSTIVE"===r.type)t.dynamicEnumData={type:"EXAMPLES",examples:r.topK?n.slice(0,r.topK):n};else if("MIN_MAX"===r.type&&"NUMBER"===r.format){const e=n.map((e=>parseFloat(e))).filter((e=>!isNaN(e))),r=Math.min(...e),o=Math.max(...e);t.dynamicEnumData={type:"MIN_MAX",min:Number.isInteger(r)?r.toString():r.toFixed(2),exceptions:n.filter((e=>isNaN(parseFloat(e)))),max:Number.isInteger(o)?o.toString():o.toFixed(2)}}else if("MIN_MAX"===r.type&&"DATE"===r.format){const e=n.map((e=>Date.parse(e))).filter((e=>!isNaN(e)));try{t.dynamicEnumData={type:"MIN_MAX",exceptions:n.filter((e=>isNaN(Date.parse(e)))),min:new Date(Math.min(...e)).toISOString(),max:new Date(Math.max(...e)).toISOString()}}catch(n){console.error("Could not parse date enums for column ",t.name," - ",n),console.error("Enums: ",e)}}else if("EXHAUSTIVE_CHAR_LIMITED"===r.type){const e=[];let o=0;for(const t of n){if(o+t.length>r.charLimit)break;e.push(t),o+=t.length}t.dynamicEnumData={type:"EXAMPLES",examples:e}}}}insert(e,t=!1){const n=this.db.insert(e,t);if(this.computeEnums(),this.getKeyFromObject&&this.elementDict)for(const t of e)this.elementDict[this.getKeyFromObject(t)]=t;return"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Inserted. New DDL: ",(0,c.generateSQLDDL)(this.tables,!0)),n}remove(e){if(this.elementDict)if(e)for(const t of e)delete this.elementDict[t];else this.elementDict={};return e?this.db.delete(e):this.db.clearDb()}generateSearchMessages(e,t=!1){var n;this.saveHistory&&(this.latestIncompleteQuestion=e);const r=this.getQueryPrefix(t);return(0,l.generateLLMMessages)((0,c.generateSQLDDL)(this.tables,!0),e,r,this.history.filter((e=>e.queryPrefix===r)),t?"analytics":"search",null===(n=this.llmConfig.fewShotLearning)||void 0===n?void 0:n.filter((e=>e.queryPrefix===r)),this.llmConfig.enableTodaysDate)}cantReturnFullObjects(){return!this.getKeyFromObject||!this.elementDict}searchWithPartialQuery(e,t,n=!1){this.saveHistory&&this.latestIncompleteQuestion&&this.history.push({queryPrefix:this.getQueryPrefix(n),question:this.latestIncompleteQuestion,partialQuery:e}),this.latestIncompleteQuestion=null;const r=this.getQueryPrefix(n)+" "+e;return t&&console.log("\nQuery: ",r),this.cantReturnFullObjects()||n?{query:r,rawResults:this.db.complexQuery(r)}:this.db.rawQuery(r).map((e=>this.elementDict[e])).filter((e=>!!e))}getQueryFromLLM(e,t=!1){return r(this,void 0,void 0,(function*(){if(!this.callLLM)throw new Error("No LLM call function provided. Use generateSearchMessages instead if you intent to make your own calls.");let n=yield this.callLLM(e,this.getQueryPrefix(t));if(!n)throw new Error("Could not generate query from question with LLM");const r=n.match(/```sql([\s\S]*?)```/g);if((null==r?void 0:r.length)&&(n=r[0].replace(/```sql/g,"").replace(/```/g,"").trim()),n.toLowerCase().startsWith(this.getQueryPrefix(t).toLowerCase())&&(n=n.substring(this.getQueryPrefix(t).length).trim()),t){const e=/^\s*?SELECT\s/;e.test(n)&&(n=n.replace(e,"").trim())}else{const e=/^\s*?SELECT[\s\S]*?FROM[\s\S]+?\s/;e.test(n)&&(n=n.replace(e,"").trim())}const o=n.indexOf(";");return-1!==o&&(n=n.substring(0,o).trim()),n}))}autoSearch(e,t,n,o,i,l,h,d,y){return r(this,void 0,void 0,(function*(){if(d||(d=e),h&&console.log(`\n----------------------------------------------\nAutosearch Rounds Left: ${n+1},\n   Main Question: ${e}\n   Current question: ${d}.\n   Searching...`),this.cantReturnFullObjects())throw new Error("Please provide a getKeyFromObject function at creation to use autoSearch. Otherwise, use search instead.");if(i||(i=this.callLLM),!i)throw new Error("Please provide a callLLM function at creation or as a parameter to use autoSearch. Otherwise, use search instead.");const r=this.generateSearchMessages(d),f=yield this.getQueryFromLLM(r);let p=[];try{p=this.searchWithPartialQuery(f,l)}catch(e){h&&console.error("Error in query ",f," - reflecting and fixing..."),p=yield this.attemptReflection([...r],f,e,!1,h)}if(h&&(p.length?console.log(`\nFiltered ${p.length} from ${Object.keys(this.elementDict).length}. Top result: `,t(p[0])):console.log("\nNo results.")),n<=0)return p;y||(y=[]),y.push({question:d,query:this.getQueryPrefix(!1)+" "+f,results:{count:p.length,topResultStr:p.length?t(p[0]):"No results."}});const m=(0,s.generateAutoSearchMessages)((0,c.generateSQLDDL)(this.tables,!0),e,y);h&&console.log("\nAnalysing...");let g=yield i(m);if(!g)throw new Error("Could not generate analysis from LLM.");g=function(e){const t=e.match(/\{[^{}]*\}/);return t?t[0].slice(1,-1):e}("{"+g+"}"),g=`{${g}}`;try{const r=yield(0,a.fixJSON)(i,g);if(null===r)return h&&p.length&&console.log("No results, returning results from previous improvement ",d),p;for(const e of u.potentialArrayAnalysisFields)r[e]?Array.isArray(r[e])||(r[e]=[r[e]]):r[e]=[];if(h&&console.log(`Success: ${r.suitability} (${r.suitabilityDesc}), Success threshold: ${o}`),y[y.length-1].suitabilityDesc=r.suitabilityDesc,y[y.length-1].suitabilityScore=r.suitability,r.suitability>=o)return h&&console.log("Success! Returning results."),p;h&&(console.log("\nUser desires: ","\n - "+r.desires.join("\n - ")),console.log("\nThoughts: ","\n - "+r.thoughts.join("\n - ")),console.log("\nBetter filters: ","\n - "+r.betterFilters.join("\n - ")),console.log("\n\nBetter question: ",r.betterQuestion));const s=yield this.autoSearch(e,t,n-1,o,i,l,h,r.betterQuestion,y);return s.length?s:(h&&p.length&&console.log("No results, returning results from previous improvement ",d),p)}catch(e){return console.error("Could not parse JSON analysis from this string - ",g," - ",e),p}}))}complexAnalytics(e,t=!1,n=!0){return r(this,void 0,void 0,(function*(){const r=this.generateSearchMessages(e,!0),s=yield this.getQueryFromLLM(r,!0);try{const e=this.searchWithPartialQuery(s,t,!0);return(0,o.addColumnTypes)(e,this.tables)}catch(e){if(n){const n=yield this.attemptReflection([...r],s,e,!0,t);return(0,o.addColumnTypes)(n,this.tables)}throw e}}))}search(e,t,n){return r(this,void 0,void 0,(function*(){const r=this.generateSearchMessages(e),o=yield this.getQueryFromLLM(r);try{return this.searchWithPartialQuery(o,t)}catch(e){if(n)return yield this.attemptReflection([...r],o,e,!1,t);throw e}}))}tryAndFixQuery(e,t,n,o=!1,s){return r(this,void 0,void 0,(function*(){return s&&console.error("Error in query ",t," - reflecting and fixing..."),e.push({role:"assistant",content:this.getQueryPrefix(o)+" "+t}),e.push({role:"user",content:l.searchPrompt.reflection(n.toString(),this.getQueryPrefix(o))}),yield this.getQueryFromLLM(e,o)}))}attemptReflection(e,t,n,o=!1,s){return r(this,void 0,void 0,(function*(){const r=yield this.tryAndFixQuery(e,t,n,o,s);return this.searchWithPartialQuery(r,s,o)}))}autoGenerateFewShot(e,t,n=!1,o=!1,s=!1,i=!1){var a,c;return r(this,void 0,void 0,(function*(){const r=this.getQueryPrefix(i);if(this.latestIncompleteQuestion)throw new Error("It seems there is a search in progress, or partially completed. FewShot generation is best done at the very beginning, after seeding your data.");if(this.cantReturnFullObjects())throw new Error("Please provide a getKeyFromObject function at creation to use autoFewShot Generation.");const u=[...this.history],h=this.callLLM;this.history=[],this.callLLM=e;let d=[];s&&console.log("############# Generating few-shot learning ########################");for(const e of t)try{const t=[...this.history];s&&console.log("Question: ",e.question),e.clearHistory&&(this.history=[]);const o=yield this.getQueryFromLLM(this.generateSearchMessages(e.question,i),i);s&&console.log(`Full Query: ${r} ${o}`);let a=!1;const c=this.searchWithPartialQuery(o,!1,i);i&&0===c.rawResults.length?a=!0:i||0!==c.length||(a=!0),console.log("No results? ",a),n&&a?(s&&console.log("Skipping question with 0 results."),this.history=t):d.push({queryPrefix:r,question:`${e.clearHistory?l.HISTORY_RESET_COMMAND+" ":""}${e.question}`,partialQuery:o})}catch(t){if(o)throw this.history=u,this.callLLM=h,new Error(`Could not process question ${e.question} - ${t}`);console.error("Could not process question ",e.question," - ",t)}return s&&console.log("############## Generated examples:",JSON.stringify(d,null,2)),this.history=u,this.callLLM=h,this.llmConfig.fewShotLearning=null===(a=this.llmConfig.fewShotLearning)||void 0===a?void 0:a.filter((e=>e.partialQuery!==r)),null===(c=this.llmConfig.fewShotLearning)||void 0===c||c.push(...d),d}))}}t.WishfulSearchEngine=h},175:(e,t)=>{function n(e,t){const n=e.columns.filter((e=>e.foreignKey)).map((e=>{var t,n;return`FOREIGN KEY (${e.name}) REFERENCES ${null===(t=e.foreignKey)||void 0===t?void 0:t.table}(${null===(n=e.foreignKey)||void 0===n?void 0:n.column}) ON DELETE CASCADE`})),r=e.columns.filter((e=>!t||e.visibleToLLM)).map(((r,o)=>{const s=t&&function(e){var t,n,r;let o="";"EXAMPLES"===(null===(t=e.dynamicEnumData)||void 0===t?void 0:t.type)?o=`e.g. ${e.dynamicEnumData.examples.join(", ")}`:"MIN_MAX"===(null===(n=e.dynamicEnumData)||void 0===n?void 0:n.type)?(o=`between ${e.dynamicEnumData.min} and ${e.dynamicEnumData.max}`,e.dynamicEnumData.exceptions.length&&(o+=` (or ${e.dynamicEnumData.exceptions.map((e=>String(e))).join(",")})`)):(null===(r=e.staticExamples)||void 0===r?void 0:r.length)&&(o=`e.g. ${e.staticExamples.join(", ")}`);const s=[];return e.description&&s.push(e.description),o&&s.push(o),s.length?` --${s.join(" ")}`:""}(r)||"";return`${r.name} ${r.columnSpec}${o>=e.columns.length-1&&!n.length?"":","}${s}`}));return`CREATE TABLE IF NOT EXISTS ${e.name} (\n${r.join("\n")}${n.length?`\n${n.join("\n")}`:""}\n);`}Object.defineProperty(t,"__esModule",{value:!0}),t.generateSQLTableDDL=t.validateStructuredDDL=t.generateSQLDDL=void 0,t.generateSQLDDL=function(e,t){return e.map((e=>n(e,t))).join("\n\n")},t.validateStructuredDDL=function(e){if(!e.length||!e[0])throw new Error("No tables found in structured DDL, or missing primary table.");if(e.length&&e[0].columns.some((e=>!!e.foreignKey)))throw new Error("Primary (first) table in the structured ddl cannot have foreign key relationships");return!0},t.generateSQLTableDDL=n},501:function(e,t,n){var r=this&&this.__await||function(e){return this instanceof r?(this.v=e,this):new r(e)},o=this&&this.__asyncGenerator||function(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,s=n.apply(e,t||[]),i=[];return o={},a("next"),a("throw"),a("return"),o[Symbol.asyncIterator]=function(){return this},o;function a(e){s[e]&&(o[e]=function(t){return new Promise((function(n,r){i.push([e,t,n,r])>1||l(e,t)}))})}function l(e,t){try{(n=s[e](t)).value instanceof r?Promise.resolve(n.value.v).then(c,u):h(i[0][2],n)}catch(e){h(i[0][3],e)}var n}function c(e){l("next",e)}function u(e){l("throw",e)}function h(e,t){e(t),i.shift(),i.length&&l(i[0][0],i[0][1])}};Object.defineProperty(t,"__esModule",{value:!0}),t.callTogetherAI=t.TogetherAITemplates=void 0;const s=n(934);t.TogetherAITemplates={"mistralai/Mixtral-8x7B-Instruct-v0.1":s.generateMistralPrompt},t.callTogetherAI=function(e,n,s=.5,i=1e4){return o(this,arguments,(function*(){if(!process.env.TOGETHERAI_API_KEY)throw new Error("TOGETHERAI_API_KEY is not set");const o={"Content-Type":"application/json",Authorization:`Bearer ${process.env.TOGETHERAI_API_KEY}`},{prompt:a,stopSequences:l}=t.TogetherAITemplates[n](e),c={model:n,prompt:a,stop:l[0],temperature:s,max_tokens:i,stream_tokens:!0},u=yield r(fetch("https://api.together.xyz/inference",{method:"POST",headers:o,body:JSON.stringify(c)}));if(200!==u.status||!u.body)return console.error("TogetherAI returned status code",u),yield yield r({type:"error",error:`TogetherAI returned status code ${u.status}`}),yield r(void 0);const h=u.body.getReader();let d="";try{for(;;){const{done:e,value:t}=yield r(h.read());if(e)break;const n=new TextDecoder("utf-8").decode(t).split("\n");for(const e of n)try{if(e.includes("[DONE]"))break;if(e.startsWith("data: ")){const t=JSON.parse(e.slice(5));t&&t.choices&&t.choices.length&&t.choices[0].text&&(yield yield r({type:"token",token:t.choices[0].text}),d+=t.choices[0].text)}}catch(t){console.error("Error parsing message - ",e,t),yield yield r({type:"error",error:t.message})}}}catch(e){yield yield r({type:"error",error:e.message})}finally{h.releaseLock(),yield yield r({type:"completeMessage",message:d})}}))}},683:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.potentialArrayAnalysisFields=t.AnalysisTypespec=t.VALID_PRIMITIVE_TYPES=void 0,t.VALID_PRIMITIVE_TYPES=["str","int","float","date","bool","enum","json"],t.AnalysisTypespec="type Analysis = {\n  suitabilityDesc: string; // Describe how suitable or unsuitable the top result is to the USER_QUESTION in one sentence.\n  suitability: number; // between 0 to 1, one if the top result matches the USER_QUESTION and zero if not.\n  desires: string[]; // What did the user want? List what may not be in the question, but is implied (or what they don't know to look for).\n  thoughts: string[]; // Based on the DDL, the question and the desires, provide thoughts on how to improve results.\n  betterFilters: string[]; // What conditions (in English) could we have to get better results?\n  betterQuestion: string; // Reformat the question to include all of the above, to be used to generate a new query. Be specific with numbers, relax filtersand reduce the question size if no results are being returned.\n}",t.potentialArrayAnalysisFields=["desires","thoughts","betterFilters"]},470:e=>{e.exports=require("sql.js")}},t={};return function n(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={exports:{}};return e[r].call(s.exports,s,s.exports,n),s.exports}(54)})()));