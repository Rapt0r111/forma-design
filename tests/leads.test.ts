import { test, expect, beforeAll, afterAll } from 'bun:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parseLead, createLead, updateLead, listLeads } from '../lib/leads';
let dir:string;
beforeAll(async()=>{dir=await mkdtemp(path.join(tmpdir(),'forma-test-'));process.env.SHOWCASE_DATA_DIR=dir;});
afterAll(async()=>{delete process.env.SHOWCASE_DATA_DIR;await rm(dir,{recursive:true,force:true});});
test('price is computed server-side; unknown package and invalid size rejected',()=>{
 expect(parseLead({name:'Demo',contact:'demo@example.com',area:84,package:'full',amount:1}).amount).toBe(378000);
 for (const area of [0,19,501,Infinity,'bad']) expect(()=>parseLead({name:'A',contact:'B',area,package:'full'})).toThrow();
 expect(()=>parseLead({name:'A',contact:'B',area:84,package:'toString'})).toThrow();
});
test('parallel enquiries survive and updates persist without erasing other records',async()=>{
 const added=await Promise.all(Array.from({length:8},(_,i)=>createLead({name:`Test ${i}`,contact:'demo@example.com',area:50,package:'concept'})));
 expect(new Set(added.map(l=>l.id)).size).toBe(8);
 await Promise.all(added.map(l=>updateLead({id:l.id,status:'proposal',note:'Reviewed'})));
 const disk=JSON.parse(await readFile(path.join(dir,'leads.json'),'utf8'));
 expect(disk).toHaveLength(13);
 expect(disk.filter((l:{note:string})=>l.note==='Reviewed')).toHaveLength(8);
 expect((await listLeads()).length).toBe(13);
});
test('invalid update cannot corrupt saved records',async()=>{
 await expect(updateLead({id:'demo-1',status:'deleted'})).rejects.toThrow();
 await expect(updateLead({id:'missing',status:'won'})).rejects.toThrow();
 expect((await listLeads()).find(l=>l.id==='demo-1')?.status).toBe('new');
});
test('update can adopt a visitor lead that is missing on this instance',async()=>{
 const adopted=await updateLead({id:'visitor-lead-1',name:'Гость',contact:'guest@example.com',area:80,package:'full',status:'contact',note:'С другого инстанса'});
 expect(adopted.id).toBe('visitor-lead-1');
 expect(adopted.status).toBe('contact');
 expect((await listLeads()).find(l=>l.id==='visitor-lead-1')?.contact).toBe('guest@example.com');
});
