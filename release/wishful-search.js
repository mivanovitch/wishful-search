!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.WishfulSearch=t():e.WishfulSearch=t()}(self,(()=>(()=>{"use strict";var e={173:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.generateAutoSearchMessages=void 0;const r=n(683),o=(e,t)=>`The user had this USER_QUESTION: ${e}\n\nWe tried the following modified questions, and got these queries and results:\n\n${t.map(((e,t)=>` - ${t+1}: "${e.question}" generated "${e.query}" which returned ${e.results.count} results with top prettified result "${e.results.topResultStr}". ${e.suitabilityDesc?`Suitability was ${e.suitabilityScore} (${e.suitabilityDesc}`:""}`)).join("\n")}\n\nWe can improve the results by looking for ways to increase suitability. Check for patterns (like consistent no resutls, same result over again, etc). Return your analysis following this typespec, and be exhaustive and thorough.\n\n'''typescript\n${r.AnalysisTypespec}\n\`\`\`\n\nValid JSON:`;t.generateAutoSearchMessages=function(e,t,n){return[{content:(r=e,`You can only return valid JSON.\n\nInformation is stored in tables with this schema:\n\`\`\`\n${r}\n\`\`\``),role:"system"},{content:o(t,n),role:"user"}];var r}},509:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,s){function i(e){try{l(r.next(e))}catch(e){s(e)}}function a(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}l((r=r.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.LLMSearcheableDatabase=void 0;const s=o(n(470));class i{static create(e,t,n,o,a){return r(this,void 0,void 0,(function*(){const r={locateFile:a?()=>a:void 0},l=yield(0,s.default)(r),c=new l.Database;return c.run(e),new i(c,l,e,t,n,o)}))}constructor(e,t,n,r,o,s){if(this.sqljsSQL=t,this.strDDL=n,this.dbname=r,this.key=o,this.objectToTabledRow=s,this.db=e,this.tableNames=this.getTableNames(),!this.tableNames.includes(o.table))throw new Error(`Primary table ${o.table} not found in database`);this.tableNames=[o.table,...this.tableNames.filter((e=>e!==o.table))]}getTableNames(){const e=this.db.exec('SELECT name FROM sqlite_master WHERE type="table"');if(!e||!e.length||!e[0])throw new Error("No tables found in database");return e[0].values.flat()}getEnums(e,t=!1){const n=t?`SELECT ${e.column}, COUNT(${e.column}) as frequency\n    FROM ${e.table}\n    GROUP BY ${e.column}\n    ORDER BY frequency DESC;`:`SELECT DISTINCT ${e.column} FROM ${e.table}`,r=this.db.exec(n);return r.length&&r[0]?t?r[0].values.map((e=>e[0])):r[0].values.flat():[]}rawQuery(e){const t=["INSERT","UPDATE","DELETE","CREATE","ALTER","DROP","PRAGMA","BEGIN","COMMIT","ROLLBACK","REPLACE"];e=e.split(";")[0].trim();for(const n of t)if(e.toUpperCase().includes(n))throw new Error(`Query must not have ${n}`);if(!e.toUpperCase().startsWith("SELECT"))throw new Error("Raw Query to db must start with SELECT");if(-1!==e.indexOf(";"))throw new Error("Raw Query to db must be a single statement");const n=this.db.exec(e);return n.length&&n[0]?n[0].values.flat():[]}complexQuery(e){if(!(e=e.split(";")[0].trim()).toUpperCase().startsWith("SELECT"))throw new Error("Raw Query to db must start with SELECT");if(-1!==e.indexOf(";"))throw new Error("Raw Query to db must be a single statement");const t=this.db.exec(e);return t.length&&t[0]?t:[]}getColumnCount(e){const t=this.db.exec(`SELECT COUNT(*) FROM pragma_table_info('${e}')`);if(!t||!t.length||!t[0])throw new Error("Tried to get columns on invalid db");return t[0].values[0][0]}delete(e){const t=e.map((e=>"?")).join(","),n=`DELETE FROM ${this.key.table} WHERE ${this.key.column} IN (${t})`;this.db.run(n,e)}insert(e,t=!1){const n=e.map((e=>this.objectToTabledRow(e))),r=n.filter((e=>e.length===this.tableNames.length));if(r.length!==n.length&&t)throw new Error(n.length-r.length+" rows do not match the number of columns in the table.");const o=[];for(const e of n)for(let n=0;n<this.tableNames.length;n++){const r=this.tableNames[n],s=this.getColumnCount(r),i=`INSERT OR IGNORE INTO ${r} VALUES (${Array(s).fill("?").join(",")})`,a=this.db.prepare(i);try{this.db.run("BEGIN"),e[n].forEach((e=>{try{a.bind(e),a.step()}catch(r){if(t)throw new Error(`Error running "${i}" inserting row ${JSON.stringify(e,null,2)} - ${r}`);o.push({index:n,error:r})}})),this.db.run("COMMIT")}catch(t){throw"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Error inserting in table ",r,", row",JSON.stringify(e,null,2),t),this.db.run("ROLLBACK"),t}}return o}clearDb(){this.db.close(),this.db=new this.sqljsSQL.Database,this.db.run(this.strDDL)}}t.LLMSearcheableDatabase=i},54:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||r(t,e,n)},s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.LLMAdapters=t.WishfulSearchEngine=void 0;var i=n(322);Object.defineProperty(t,"WishfulSearchEngine",{enumerable:!0,get:function(){return i.WishfulSearchEngine}});var a=n(738);Object.defineProperty(t,"LLMAdapters",{enumerable:!0,get:function(){return s(a).default}}),o(n(683),t)},842:function(e,t){var n=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,s){function i(e){try{l(r.next(e))}catch(e){s(e)}}function a(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}l((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.fixJSON=void 0;const r="You can only return valid JSON.",o=(e,t)=>`\nError: ${e}\n\nFix this invalid JSON and return perfectly valid JSON without changing any content:\n\n'''json\n${t}\n'''\n`,s=[{invalidJSONStr:'type Analysis = {\n  suitabilityDesc: "The top result included a layover which does not match a direct flight.",\n  suitability: 0.3,\n  desires: ["A non-stop flight", "No layovers"],\n}',error:"Uncaught SyntaxError: Unexpected token 'y', \"type Analys\"... is not valid JSON",fixedJSONStr:'{\n  "suitabilityDesc": "The top result included a layover which does not match a direct flight.",\n  "suitability": 0.3,\n  "desires": ["A non-stop flight", "No layovers"],\n}'},{invalidJSONStr:"{abc:2}",error:"Uncaught SyntaxError: Expected property name or '}' in JSON at position 1",fixedJSONStr:'{"abc":2}'}];t.fixJSON=function(e,t){return n(this,void 0,void 0,(function*(){try{return JSON.parse(t)}catch(n){const i=[{content:r,role:"system"}];for(const e of s)i.push({content:o(e.error,e.invalidJSONStr),role:"user"}),i.push({role:"assistant",content:e.fixedJSONStr});i.push({role:"user",content:o(n.toString(),t)});const a=yield e(i);return a?JSON.parse(a):null}}))}},738:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,s){function i(e){try{l(r.next(e))}catch(e){s(e)}}function a(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}l((r=r.apply(e,t||[])).next())}))},o=this&&this.__asyncValues||function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,n=e[Symbol.asyncIterator];return n?n.call(e):(e="function"==typeof __values?__values(e):e[Symbol.iterator](),t={},r("next"),r("throw"),r("return"),t[Symbol.asyncIterator]=function(){return this},t);function r(n){t[n]=e[n]&&function(t){return new Promise((function(r,o){!function(e,t,n,r){Promise.resolve(r).then((function(t){e({value:t,done:n})}),t)}(r,o,(t=e[n](t)).done,t.value)}))}}};Object.defineProperty(t,"__esModule",{value:!0}),t.getLMStudioAdapter=t.getMistralAdapter=void 0;const s=n(934),i=n(141);function a(e){const t="mistral";return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(n,a){var l,c,u,h,d,f,y;return r(this,void 0,void 0,(function*(){a&&"assistant"!==n[n.length-1].role&&n.push({role:"assistant",content:a});const{prompt:r,stopSequences:m}=s.LLMTemplateFunctions.mistral(n);"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(d=null==e?void 0:e.model)&&void 0!==d?d:t} on Ollama...`);const p=yield(0,i.callOllama)(r,null!==(f=null==e?void 0:e.model)&&void 0!==f?f:t,11434,null!==(y=null==e?void 0:e.temperature)&&void 0!==y?y:0);"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");try{for(var g,v=!0,S=o(p);g=yield S.next(),!(l=g.done);v=!0){h=g.value,v=!1;const e=h;if("completeMessage"===e.type)return"yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write(e.message.split(m[0])[0]||"<NO TOKEN RECEIVED>"),e.message.split(m[0])[0]||null}}catch(e){c={error:e}}finally{try{v||l||!(u=S.return)||(yield u.call(S))}finally{if(c)throw c.error}}return null}))}}}function l(e,t,n){const i={model:"mistral",temperature:0};return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(a,l){var c,u,h,d,f,y,m,p,g;return r(this,void 0,void 0,(function*(){l&&"assistant"!==a[a.length-1].role&&a.push({role:"assistant",content:l});const{prompt:r,stopSequences:v}=s.LLMTemplateFunctions[t](a);try{"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(f=null==n?void 0:n.model)&&void 0!==f?f:i.model} on your machine (LMStudio)...`);const t=yield e.chat.completions.create(Object.assign(Object.assign({messages:[{role:"user",content:r}]},Object.assign(Object.assign({},i),n||{})),{stop:v,stream:!0}));let s="";"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");try{for(var S,b=!0,E=o(t);S=yield E.next(),!(c=S.done);b=!0){d=S.value,b=!1;const e=d;"yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write((null===(m=null===(y=e.choices[0])||void 0===y?void 0:y.delta)||void 0===m?void 0:m.content)||""),s+=(null===(g=null===(p=e.choices[0])||void 0===p?void 0:p.delta)||void 0===g?void 0:g.content)||""}}catch(e){u={error:e}}finally{try{b||c||!(h=E.return)||(yield h.call(E))}finally{if(u)throw u.error}}return s||null}catch(e){return console.error(`Error retrieving response from model ${n}`),console.error(e),null}}))}}}t.getMistralAdapter=a,t.getLMStudioAdapter=l;const c={getOpenAIAdapter:function(e,t){const n={model:"gpt-3.5-turbo",temperature:0};return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(s,i){var a,l,c,u,h,d,f,y,m;return r(this,void 0,void 0,(function*(){if(s.length<1||!s[s.length-1])return null;if("assistant"===s[s.length-1].role){const e=s[s.length-1].content;(s=[...s.slice(0,s.length-1)])[s.length-1].content=`${s[s.length-1].content}\n\n${e}`}try{"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(h=null==t?void 0:t.model)&&void 0!==h?h:n.model} (OpenAI)...`);const g=yield e.chat.completions.create(Object.assign(Object.assign({messages:s},Object.assign(Object.assign({},n),t||{})),{stream:!0}));let v="";"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");try{for(var r,i=!0,p=o(g);r=yield p.next(),!(a=r.done);i=!0){u=r.value,i=!1;const e=u;"yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write((null===(f=null===(d=e.choices[0])||void 0===d?void 0:d.delta)||void 0===f?void 0:f.content)||""),v+=(null===(m=null===(y=e.choices[0])||void 0===y?void 0:y.delta)||void 0===m?void 0:m.content)||""}}catch(e){l={error:e}}finally{try{i||a||!(c=p.return)||(yield c.call(p))}finally{if(l)throw l.error}}return v||null}catch(e){return console.error(`Error retrieving response from model ${t}`),console.error(e),null}}))}}},getClaudeAdapter:function(e,t,n,s){const i={model:"claude-2",temperature:0};return{llmConfig:{enableTodaysDate:!0,fewShotLearning:[]},callLLM:function(a,l){var c,u,h,d,f;return r(this,void 0,void 0,(function*(){let r=a.map((n=>"user"===n.role?`${e} ${n.content}`:"assistant"===n.role?`${t} ${n.content}`:`${e} <system>${n.content}</system>`)).join("");"assistant"!==a[a.length-1].role&&(r+=`${t}${l?` ${l}`:""}`);try{"yes"===process.env.PRINT_WS_INTERNALS&&console.log(`Asking ${null!==(f=null==s?void 0:s.model)&&void 0!==f?f:i.model} (Anthropic)...\n`);const e=yield n.completions.create(Object.assign(Object.assign({prompt:r,max_tokens_to_sample:1e4},Object.assign(Object.assign({},i),s||{})),{stream:!0}));let t="";"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Streaming response: ");try{for(var y,m=!0,p=o(e);y=yield p.next(),!(c=y.done);m=!0){d=y.value,m=!1;const e=d;"yes"===process.env.PRINT_WS_INTERNALS&&process.stdout.write(e.completion||""),t+=e.completion||""}}catch(e){u={error:e}}finally{try{m||c||!(h=p.return)||(yield h.call(p))}finally{if(u)throw u.error}}return t||null}catch(e){return console.error(`Error retrieving response from model ${s}`),console.error(e),null}}))}}},getMistralAdapter:a,getLMStudioAdapter:l};t.default=c},934:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LLMTemplateFunctions=void 0,t.LLMTemplateFunctions={mistral:function(e){return{prompt:e.map(((t,n)=>"assistant"===t.role?`${t.content}${n<e.length-1?"</s>":""}`:`${n>0&&"assistant"!==e[n-1].role?"":"<s>"}[INST] ${"system"===t.role?`<system>${t.content}</system>`:t.content} [/INST]`)).join(" "),stopSequences:["</s>","<s>"]}},dolphin:function(e){let t=e.map(((t,n)=>"system"===t.role?`<|im_start|>system\n${t.content}<|im_end|>`:"user"===t.role?`<|im_start|>user\n${t.content}<|im_end|>`:`<|im_start|>assistant\n${t.content}${n<e.length-1?"<|im_end|>":""}`)).join("\n");return"assistant"!==e[e.length-1].role&&(t+="\n<|im_start|>assistant"),{prompt:t,stopSequences:["<|im_end|>","<|im_start|>"]}},"yarn-mistral":function(e){let t=e.map(((t,n)=>"system"===t.role||"user"===t.role?`### Instruction: ${t.content}\n`:`### Response: ${t.content}${n<e.length-1?"\n":""}`)).join("\n");return"assistant"!==e[e.length-1].role&&(t+="\n### Response: "),{prompt:t,stopSequences:["###"]}}}},964:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.generateLLMMessages=t.searchPrompt=t.HISTORY_RESET_COMMAND=void 0,t.HISTORY_RESET_COMMAND="Ignore all previous filters. ";const n=[{factStr:"Do not use LIMIT, DISTINCT, ARRAY_LENGTH, MAX, MIN or AVG if possible.",type:"search"},{factStr:"Try and find the right rows that can help the answer.",type:"search"},{factStr:"Prefer `strftime` to format dates better.",type:"all"},{factStr:"**Deliberately go through the question and database schema word by word** to appropriately answer the question.",type:"all"},{factStr:"Prefer sorting the right values to the top instead of filters if possible.",type:"all"},{factStr:"Use LIKE instead of equality to compare strings.",type:"all"},{factStr:"Try to continue the partial query if one is provided.",type:"all"}];t.searchPrompt={system:(e,t)=>`You are a SQLite SQL generator that helps users answer questions from the tables provided. Here are the table definitions:\n\nDATABASE_DDL:\n\`\`\`sql\n${e}\n\`\`\`\n\n${t?`Today's date: ${t}.`:""}\n\nRULES:\n"""\n${n.map(((e,t)=>`${t+1}. ${e.factStr}`)).join("\n")}\n"""\n\nProvide an appropriate SQLite Query to return the keys to answer the user's question. Only filter by the things the user asked for, and only return ids or keys.`,user:(e,n)=>`${n?t.HISTORY_RESET_COMMAND:""}${e}`,assistant:(e,t)=>`${t} ${e}`,reflection:e=>`The query ran into the following issue:\n  """\n  ${e}\n  """\n\n  Fix and provide only the new query. SQL only, in code blocks.`},t.generateLLMMessages=function(e,n,r,o,s,i){const a=i?(new Date).toLocaleDateString():void 0,l=[];if(l.push({role:"system",content:t.searchPrompt.system(e,a)}),s)for(const{question:e,partialQuery:n}of s)l.push({role:"user",content:t.searchPrompt.user(e,!1)}),l.push({role:"assistant",content:t.searchPrompt.assistant(n,r)});if(o)for(const{question:e,partialQuery:n}of o)l.push({role:"user",content:t.searchPrompt.user(e,!1)}),l.push({role:"assistant",content:t.searchPrompt.assistant(n,r)});return l.push({role:"user",content:t.searchPrompt.user(n,!(o.length>0))}),!(null==s?void 0:s.length)&&r&&l.push({role:"assistant",content:r}),l}},141:function(e,t){var n=this&&this.__await||function(e){return this instanceof n?(this.v=e,this):new n(e)},r=this&&this.__asyncGenerator||function(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,s=r.apply(e,t||[]),i=[];return o={},a("next"),a("throw"),a("return"),o[Symbol.asyncIterator]=function(){return this},o;function a(e){s[e]&&(o[e]=function(t){return new Promise((function(n,r){i.push([e,t,n,r])>1||l(e,t)}))})}function l(e,t){try{(r=s[e](t)).value instanceof n?Promise.resolve(r.value.v).then(c,u):h(i[0][2],r)}catch(e){h(i[0][3],e)}var r}function c(e){l("next",e)}function u(e){l("throw",e)}function h(e,t){e(t),i.shift(),i.length&&l(i[0][0],i[0][1])}};Object.defineProperty(t,"__esModule",{value:!0}),t.callOllama=void 0,t.callOllama=function(e,t,o=11434,s=0){return r(this,arguments,(function*(){const r=JSON.stringify({model:t,template:e,options:{temperature:s}}),i=yield n(fetch(`http://localhost:${o}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:r}));if(!i.ok)throw new Error(`Ollama fetch failed with status: ${i.status}`);{const e=i.body.getReader();let t="",r="";for(;;){const{done:o,value:s}=yield n(e.read());if(o)break;for(t+=(new TextDecoder).decode(s);;){const e=t.indexOf("{"),o=t.indexOf("}");if(-1===e||-1===o)break;{const s=t.slice(e,o+1);try{const e=JSON.parse(s);if(!e.model)throw new Error("Unrecognized response from ollama - missing model field");if(e.response&&(yield yield n({type:"token",token:e.response}),r+=e.response),e.done||-1!==r.indexOf("</s>"))return yield yield n({type:"completeMessage",message:r}),yield n(void 0);t=t.slice(o+1)}catch(e){throw console.error("Error parsing Ollama response object - ",s),e}}}}}}))}},322:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,s){function i(e){try{l(r.next(e))}catch(e){s(e)}}function a(e){try{l(r.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}l((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.WishfulSearchEngine=void 0;const o=n(173),s=n(509),i=n(842),a=n(964),l=n(175),c=n(683);class u{static create(e,t,n,o,i,a,c,h=!0,d=!0,f=!1,y){return r(this,void 0,void 0,(function*(){(0,l.validateStructuredDDL)(t);const r=yield s.LLMSearcheableDatabase.create((0,l.generateSQLDDL)(t,!0),e,n,o,y);return new u(r,e,t,n,i,a,c,h,d,f)}))}constructor(e,t,n,r,o,s,i,a,l,c){this.name=t,this.tables=n,this.primaryKey=r,this.llmConfig=o,this.getKeyFromObject=i,this.saveHistory=a,this.enableDynamicEnums=l,this.sortEnumsByFrequency=c,this.history=[],this.db=e,this.latestIncompleteQuestion=null,this.elementDict=i?{}:null,this.callLLM=s}getQueryPrefix(e=!1){return e?"SELECT ":`SELECT ${this.primaryKey.column} FROM ${this.primaryKey.table}`}computeEnums(){if(this.enableDynamicEnums)for(const e of this.tables)for(const t of e.columns.filter((e=>void 0!==e.dynamicEnumSettings))){const n=this.db.getEnums({table:e.name,column:t.name},this.sortEnumsByFrequency),r=t.dynamicEnumSettings;if("EXHAUSTIVE"===r.type)t.dynamicEnumData={type:"EXAMPLES",examples:r.topK?n.slice(0,r.topK):n};else if("MIN_MAX"===r.type&&"NUMBER"===r.format){const e=n.map((e=>parseFloat(e))).filter((e=>!isNaN(e))),r=Math.min(...e),o=Math.max(...e);t.dynamicEnumData={type:"MIN_MAX",min:Number.isInteger(r)?r.toString():r.toFixed(2),exceptions:n.filter((e=>isNaN(parseFloat(e)))),max:Number.isInteger(o)?o.toString():o.toFixed(2)}}else if("MIN_MAX"===r.type&&"DATE"===r.format){const e=n.map((e=>Date.parse(e))).filter((e=>!isNaN(e)));try{t.dynamicEnumData={type:"MIN_MAX",exceptions:n.filter((e=>isNaN(Date.parse(e)))),min:new Date(Math.min(...e)).toISOString(),max:new Date(Math.max(...e)).toISOString()}}catch(n){console.error("Could not parse date enums for column ",t.name," - ",n),console.error("Enums: ",e)}}else if("EXHAUSTIVE_CHAR_LIMITED"===r.type){const e=[];let o=0;for(const t of n){if(o+t.length>r.charLimit)break;e.push(t),o+=t.length}t.dynamicEnumData={type:"EXAMPLES",examples:e}}}}insert(e,t=!1){const n=this.db.insert(e,t);if(this.computeEnums(),this.getKeyFromObject&&this.elementDict)for(const t of e)this.elementDict[this.getKeyFromObject(t)]=t;return"yes"===process.env.PRINT_WS_INTERNALS&&console.log("Inserted. New DDL: ",(0,l.generateSQLDDL)(this.tables,!0)),n}remove(e){if(this.elementDict)if(e)for(const t of e)delete this.elementDict[t];else this.elementDict={};return e?this.db.delete(e):this.db.clearDb()}generateSearchMessages(e,t=!1){var n;this.saveHistory&&(this.latestIncompleteQuestion=e);const r=this.getQueryPrefix(t),o=(0,a.generateLLMMessages)((0,l.generateSQLDDL)(this.tables,!0),e,r,this.history.filter((e=>e.queryPrefix===r)),null===(n=this.llmConfig.fewShotLearning)||void 0===n?void 0:n.filter((e=>e.queryPrefix===r)),this.llmConfig.enableTodaysDate);return console.log("Messages - ",JSON.stringify(o,null,2)),o}cantReturnFullObjects(){return!this.getKeyFromObject||!this.elementDict}searchWithPartialQuery(e,t,n=!1){this.saveHistory&&this.latestIncompleteQuestion&&this.history.push({queryPrefix:this.getQueryPrefix(n),question:this.latestIncompleteQuestion,partialQuery:e}),this.latestIncompleteQuestion=null;const r=this.getQueryPrefix(n)+" "+e;return t&&console.log("\nQuery: ",r),this.cantReturnFullObjects()||n?{query:r,rawResults:this.db.complexQuery(r)}:this.db.rawQuery(r).map((e=>this.elementDict[e])).filter((e=>!!e))}getQueryFromLLM(e,t=!1){return r(this,void 0,void 0,(function*(){if(!this.callLLM)throw new Error("No LLM call function provided. Use generateSearchMessages instead if you intent to make your own calls.");let n=yield this.callLLM(e,this.getQueryPrefix(t));if(!n)throw new Error("Could not generate query from question with LLM");const r=n.match(/```sql([\s\S]*?)```/g);if((null==r?void 0:r.length)&&(n=r[0].replace(/```sql/g,"").replace(/```/g,"").trim()),n.toLowerCase().startsWith(this.getQueryPrefix(t).toLowerCase())&&(n=n.substring(this.getQueryPrefix(t).length).trim()),t){const e=/^\s*?SELECT\s/;e.test(n)&&(n=n.replace(e,"").trim())}else{const e=/^\s*?SELECT[\s\S]*?FROM[\s\S]+?\s/;e.test(n)&&(n=n.replace(e,"").trim())}const o=n.indexOf(";");return-1!==o&&(n=n.substring(0,o).trim()),n}))}autoSearch(e,t,n,s,a,u,h,d,f){return r(this,void 0,void 0,(function*(){if(d||(d=e),h&&console.log(`\n----------------------------------------------\nAutosearch Rounds Left: ${n+1},\n   Main Question: ${e}\n   Current question: ${d}.\n   Searching...`),this.cantReturnFullObjects())throw new Error("Please provide a getKeyFromObject function at creation to use autoSearch. Otherwise, use search instead.");if(a||(a=this.callLLM),!a)throw new Error("Please provide a callLLM function at creation or as a parameter to use autoSearch. Otherwise, use search instead.");const r=this.generateSearchMessages(d),y=yield this.getQueryFromLLM(r);let m=[];try{m=this.searchWithPartialQuery(y,u)}catch(e){h&&console.error("Error in query ",y," - reflecting and fixing..."),m=yield this.attemptReflection([...r],y,e,!1,h)}if(h&&(m.length?console.log(`\nFiltered ${m.length} from ${Object.keys(this.elementDict).length}. Top result: `,t(m[0])):console.log("\nNo results.")),n<=0)return m;f||(f=[]),f.push({question:d,query:this.getQueryPrefix(!1)+" "+y,results:{count:m.length,topResultStr:m.length?t(m[0]):"No results."}});const p=(0,o.generateAutoSearchMessages)((0,l.generateSQLDDL)(this.tables,!0),e,f);h&&console.log("\nAnalysing...");let g=yield a(p);if(!g)throw new Error("Could not generate analysis from LLM.");g=function(e){const t=e.match(/\{[^{}]*\}/);return t?t[0].slice(1,-1):e}("{"+g+"}"),g=`{${g}}`;try{const r=yield(0,i.fixJSON)(a,g);if(null===r)return h&&m.length&&console.log("No results, returning results from previous improvement ",d),m;for(const e of c.potentialArrayAnalysisFields)r[e]?Array.isArray(r[e])||(r[e]=[r[e]]):r[e]=[];if(h&&console.log(`Success: ${r.suitability} (${r.suitabilityDesc}), Success threshold: ${s}`),f[f.length-1].suitabilityDesc=r.suitabilityDesc,f[f.length-1].suitabilityScore=r.suitability,r.suitability>=s)return h&&console.log("Success! Returning results."),m;h&&(console.log("\nUser desires: ","\n - "+r.desires.join("\n - ")),console.log("\nThoughts: ","\n - "+r.thoughts.join("\n - ")),console.log("\nBetter filters: ","\n - "+r.betterFilters.join("\n - ")),console.log("\n\nBetter question: ",r.betterQuestion));const o=yield this.autoSearch(e,t,n-1,s,a,u,h,r.betterQuestion,f);return o.length?o:(h&&m.length&&console.log("No results, returning results from previous improvement ",d),m)}catch(e){return console.error("Could not parse JSON analysis from this string - ",g," - ",e),m}}))}complexAnalytics(e,t=!1,n=!0){return r(this,void 0,void 0,(function*(){const r=this.generateSearchMessages(e,!0),o=yield this.getQueryFromLLM(r,!0);try{return this.searchWithPartialQuery(o,t,!0)}catch(e){if(n)return yield this.attemptReflection([...r],o,e,!0,t);throw e}}))}search(e,t,n){return r(this,void 0,void 0,(function*(){const r=this.generateSearchMessages(e),o=yield this.getQueryFromLLM(r);try{return this.searchWithPartialQuery(o,t)}catch(e){if(n)return yield this.attemptReflection([...r],o,e,!1,t);throw e}}))}attemptReflection(e,t,n,o=!1,s){return r(this,void 0,void 0,(function*(){s&&console.error("Error in query ",t," - reflecting and fixing..."),e.push({role:"assistant",content:this.getQueryPrefix(o)+" "+t}),e.push({role:"user",content:a.searchPrompt.reflection(n.toString())});const r=yield this.getQueryFromLLM(e,o);return this.searchWithPartialQuery(r,s,o)}))}autoGenerateFewShot(e,t,n=!1,o=!1,s=!1){var i,l;return r(this,void 0,void 0,(function*(){const r=this.getQueryPrefix(!1);if(this.latestIncompleteQuestion)throw new Error("It seems there is a search in progress, or partially completed. FewShot generation is best done at the very beginning, after seeding your data.");if(this.cantReturnFullObjects())throw new Error("Please provide a getKeyFromObject function at creation to use autoFewShot Generation.");const c=[...this.history],u=this.callLLM;this.history=[],this.callLLM=e;let h=[];s&&console.log("############# Generating few-shot learning ########################");for(const e of t)try{const t=[...this.history];s&&console.log("Question: ",e.question),e.clearHistory&&(this.history=[]);const o=yield this.getQueryFromLLM(this.generateSearchMessages(e.question));s&&console.log(`Full Query: ${this.getQueryPrefix(!1)} ${o}`);const i=this.searchWithPartialQuery(o);s&&console.log(`Got ${i.length} results.`),!n||i.length?h.push({queryPrefix:r,question:`${e.clearHistory?a.HISTORY_RESET_COMMAND+" ":""}${e.question}`,partialQuery:o}):(s&&console.log("Skipping question with 0 results."),this.history=t)}catch(t){if(o)throw this.history=c,this.callLLM=u,new Error(`Could not process question ${e.question} - ${t}`);console.error("Could not process question ",e.question," - ",t)}return s&&console.log("############## Generated examples:",JSON.stringify(h,null,2)),this.history=c,this.callLLM=u,this.llmConfig.fewShotLearning=null===(i=this.llmConfig.fewShotLearning)||void 0===i?void 0:i.filter((e=>e.partialQuery!==r)),null===(l=this.llmConfig.fewShotLearning)||void 0===l||l.push(...h),h}))}}t.WishfulSearchEngine=u},175:(e,t)=>{function n(e,t){const n=e.columns.filter((e=>e.foreignKey)).map((e=>{var t,n;return`FOREIGN KEY (${e.name}) REFERENCES ${null===(t=e.foreignKey)||void 0===t?void 0:t.table}(${null===(n=e.foreignKey)||void 0===n?void 0:n.column}) ON DELETE CASCADE`})),r=e.columns.filter((e=>!t||e.visibleToLLM)).map(((r,o)=>{const s=t&&function(e){var t,n,r;let o="";"EXAMPLES"===(null===(t=e.dynamicEnumData)||void 0===t?void 0:t.type)?o=`e.g. ${e.dynamicEnumData.examples.join(", ")}`:"MIN_MAX"===(null===(n=e.dynamicEnumData)||void 0===n?void 0:n.type)?(o=`between ${e.dynamicEnumData.min} and ${e.dynamicEnumData.max}`,e.dynamicEnumData.exceptions.length&&(o+=` (or ${e.dynamicEnumData.exceptions.map((e=>String(e))).join(",")})`)):(null===(r=e.staticExamples)||void 0===r?void 0:r.length)&&(o=`e.g. ${e.staticExamples.join(", ")}`);const s=[];return e.description&&s.push(e.description),o&&s.push(o),s.length?` --${s.join(" ")}`:""}(r)||"";return`${r.name} ${r.columnSpec}${o>=e.columns.length-1&&!n.length?"":","}${s}`}));return`CREATE TABLE IF NOT EXISTS ${e.name} (\n${r.join("\n")}${n.length?`\n${n.join("\n")}`:""}\n);`}Object.defineProperty(t,"__esModule",{value:!0}),t.generateSQLTableDDL=t.validateStructuredDDL=t.generateSQLDDL=void 0,t.generateSQLDDL=function(e,t){return e.map((e=>n(e,t))).join("\n\n")},t.validateStructuredDDL=function(e){if(!e.length||!e[0])throw new Error("No tables found in structured DDL, or missing primary table.");if(e.length&&e[0].columns.some((e=>!!e.foreignKey)))throw new Error("Primary (first) table in the structured ddl cannot have foreign key relationships");return!0},t.generateSQLTableDDL=n},683:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.potentialArrayAnalysisFields=t.AnalysisTypespec=void 0,t.AnalysisTypespec="type Analysis = {\n  suitabilityDesc: string; // Describe how suitable or unsuitable the top result is to the USER_QUESTION in one sentence.\n  suitability: number; // between 0 to 1, one if the top result matches the USER_QUESTION and zero if not.\n  desires: string[]; // What did the user want? List what may not be in the question, but is implied (or what they don't know to look for).\n  thoughts: string[]; // Based on the DDL, the question and the desires, provide thoughts on how to improve results.\n  betterFilters: string[]; // What conditions (in English) could we have to get better results?\n  betterQuestion: string; // Reformat the question to include all of the above, to be used to generate a new query. Be specific with numbers, relax filtersand reduce the question size if no results are being returned.\n}",t.potentialArrayAnalysisFields=["desires","thoughts","betterFilters"]},470:e=>{e.exports=require("sql.js")}},t={};return function n(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={exports:{}};return e[r].call(s.exports,s,s.exports,n),s.exports}(54)})()));