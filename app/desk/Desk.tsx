"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, ChevronRight, LayoutGrid, List, Plus, Search, X, LoaderCircle } from "lucide-react";
import { BrandMark } from "../brand";
import { author, authorMailto } from "@/lib/contact";
import { moneyRub as money } from "@/lib/money";
import { mergeRemoteLeads, rememberVisitorLead } from "@/lib/visitor";
import "./desk.css";

type Status = "new" | "contact" | "proposal" | "won";
type Package = "concept" | "full" | "supervision";
type Lead = { id: string; name: string; contact: string; area: number; package: Package; note: string; status: Status; amount: number; createdAt: string };
const stages: { id: Status; label: string; color: string }[] = [{id:"new",label:"Новые",color:"#8fb0ff"},{id:"contact",label:"На связи",color:"#e4c28a"},{id:"proposal",label:"Предложение",color:"#c4a3e0"},{id:"won",label:"Сделка",color:"#8fbfa0"}];
const packages: Record<Package,string> = {concept:"Концепция",full:"Полный проект",supervision:"Авторское сопровождение"};
const date = (v: string) => new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"short",year:"numeric"}).format(new Date(v)).replace(/[\u00A0\u202F\u2009]/g, "\u00A0");

export default function Desk() {
  const [leads,setLeads]=useState<Lead[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [query,setQuery]=useState("");
  const [view,setView]=useState<"board"|"list">("board");
  const [selected,setSelected]=useState<string|null>(null);
  const [creating,setCreating]=useState(false);
  const [busy,setBusy]=useState(false);
  const [formError,setFormError]=useState("");
  const [note,setNote]=useState("");
  const [status,setStatus]=useState<Status>("new");
  const [saved,setSaved]=useState(false);
  const [storage,setStorage]=useState("");
  const refresh=useCallback(async(signal?:AbortSignal)=>{
    setError("");
    try {
      const r=await fetch("/api/leads",{cache:"no-store",signal});
      if(!r.ok)throw new Error();
      const d=await r.json();
      setStorage(typeof d.storage==="string"?d.storage:"");
      setLeads(mergeRemoteLeads(d.leads||[]));
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setLeads(mergeRemoteLeads([]));
      setError("Не удалось загрузить заявки. Проверьте соединение и попробуйте снова.");
    } finally {setLoading(false);}
  },[]);
  useEffect(()=>{
    const ac=new AbortController();
    void refresh(ac.signal);
    return ()=>ac.abort();
  },[refresh]);
  const current=leads.find(l=>l.id===selected);
  const filtered=leads.filter(l=>`${l.name} ${l.contact} ${packages[l.package]}`.toLowerCase().includes(query.toLowerCase().trim()));
  const open=(lead:Lead)=>{setSelected(lead.id);setNote(lead.note||"");setStatus(lead.status);setFormError("");setSaved(false);};
  const close=()=>{if(!busy){setCreating(false);setSelected(null);setFormError("");}};
  useEffect(()=>{if(!creating&&!selected)return;const previous=document.activeElement as HTMLElement|null;const panel=document.querySelector<HTMLElement>(".desk-panel");const focusable=()=>Array.from(panel?.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,textarea,a[href]')||[]);focusable()[0]?.focus();const oldOverflow=document.body.style.overflow;document.body.style.overflow="hidden";const fn=(e:KeyboardEvent)=>{if(e.key!=="Tab")return;const elements=focusable();const first=elements[0],last=elements[elements.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};document.addEventListener("keydown",fn);return()=>{document.body.style.overflow=oldOverflow;document.removeEventListener("keydown",fn);previous?.focus();};},[creating,selected]);
  useEffect(()=>{if(!creating&&!selected)return; const fn=(e:KeyboardEvent)=>{if(e.key==="Escape"&&!busy){setCreating(false);setSelected(null);}};document.addEventListener("keydown",fn);return()=>document.removeEventListener("keydown",fn);},[creating,selected,busy]);
  async function mutate(body: Record<string,unknown>,method:"POST"|"PATCH") {
    setBusy(true);setFormError("");setSaved(false);
    try {const r=await fetch("/api/leads",{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); const d=await r.json(); if(!r.ok)throw new Error(typeof d.error==="string"?d.error:"Не удалось сохранить заявку."); if(d.lead) rememberVisitorLead(d.lead); await refresh();if(method==="POST")setCreating(false);else setSaved(true);}
    catch(e){setFormError(e instanceof Error?e.message:"Не удалось сохранить. Попробуйте ещё раз.");}
    finally{setBusy(false);}
  }
  function exportCsv() {
    const cell=(v:unknown)=>{const s=String(v??"");return '"'+(/^[\s]*[=+@-]/.test(s)?"'":"")+s.replaceAll('"','""')+'"';};
    const rows=[["Имя","Контакт","Площадь","Пакет","Этап","Сумма, ₽","Дата","Заметка"],...filtered.map(l=>[l.name,l.contact,l.area,packages[l.package],stages.find(s=>s.id===l.status)?.label,l.amount,l.createdAt,l.note])];
    const url=URL.createObjectURL(new Blob(["\uFEFF"+rows.map(row=>row.map(cell).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8;"}));const a=document.createElement("a");a.href=url;a.download="potok-leads.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <div className="desk-app">
    <aside className="desk-sidebar"><a className="desk-brand" href="/desk"><BrandMark size={26}/> ПОТОК<span>CRM</span></a><div className="desk-workspace"><span className="desk-avatar">Ф</span><div>FORMA Studio<small>Демонстрационное пространство</small></div></div><p className="desk-nav-label">РАБОЧЕЕ ПРОСТРАНСТВО</p><a className="desk-nav-active" href="/desk"><LayoutGrid size={18}/> Заявки <span>{loading?"—":leads.length}</span></a><div className="desk-side-bottom"><div className="desk-demo-dot"/>Демоверсия портфолио<p>Все примеры вымышлены.{storage==="kv"?<><br/>Заявки в общем KV-хранилище.</>:storage==="memory"?<><br/>Без KV заявка остаётся в этом браузере.</>:<><br/>Заявки на диске этого окружения.</>}</p><div className="desk-author"><a href={author.telegram} target="_blank" rel="noopener noreferrer">Telegram · {author.telegramLabel}</a><a href={authorMailto}>{author.email}</a></div><a href="/">К студии <ArrowUpRight size={16}/></a></div></aside>
    <main className="desk-main"><header className="desk-topbar"><span>Рабочее пространство <ChevronRight size={14}/> <strong>Заявки</strong></span><span className="desk-demo-label">ДЕМО</span></header>
      <section className="desk-content"><div className="desk-heading"><div><span className="desk-eyebrow">ОТ ПЕРВОГО КОНТАКТА ДО ПРОЕКТА</span><h1>Всё начинается с <span>заявки.</span></h1><p>Клиенты, договорённости и следующий шаг — в одном месте.</p></div><button className="desk-primary" onClick={()=>{setCreating(true);setFormError("");}}><Plus size={18}/> Новая заявка</button></div>
      <div className="desk-stats"><div><span>Всего заявок</span><strong>{loading?"—":leads.length}<small>в пространстве</small></strong></div><div><span>В работе</span><strong>{loading?"—":leads.filter(l=>l.status!=="won").length}<small>до сделки</small></strong></div><div><span>Потенциал открытых заявок</span><strong>{loading?"—":money(leads.filter(l=>l.status!=="won").reduce((a,l)=>a+l.amount,0))}</strong></div><div><span>Сумма сделок</span><strong>{loading?"—":money(leads.filter(l=>l.status==="won").reduce((a,l)=>a+l.amount,0))}</strong></div></div>
      <div className="desk-toolbar"><div className="desk-section-title">Заявки <span>{loading?"—":filtered.length}</span></div><div className="desk-tools"><label className="desk-search"><Search size={17}/><input aria-label="Поиск заявок" placeholder="Имя, контакт или пакет" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button aria-label="Очистить поиск" onClick={()=>setQuery("")}><X size={14}/></button>}</label><div className="desk-view"><button aria-label="Доска" aria-pressed={view==="board"} onClick={()=>setView("board")}><LayoutGrid size={17}/></button><button aria-label="Список" aria-pressed={view==="list"} onClick={()=>setView("list")}><List size={19}/></button></div><button className="desk-export" onClick={exportCsv} disabled={!filtered.length} title="Скачать найденные заявки в CSV"><ArrowDownToLine size={17}/><span>Экспорт</span></button></div></div>
      {error&&<div className="desk-error" role="alert">{error}<button onClick={()=>void refresh()}>Повторить</button></div>}
      {loading?<div className="desk-empty"><LoaderCircle className="desk-spin"/> Загружаем заявки…</div>:!filtered.length?<div className="desk-empty"><Search size={28}/><h2>{query?"Ничего не найдено":"Пока нет заявок"}</h2><p>{query?"Попробуйте другое имя, контакт или пакет.":"Добавьте первую заявку или оставьте её на сайте студии."}</p><button className="desk-secondary" onClick={()=>query?setQuery(""):setCreating(true)}>{query?"Сбросить поиск":"Добавить заявку"}</button></div>:view==="board"?<div className="desk-board">{stages.map(stage=><section className="desk-column" key={stage.id}><div className="desk-column-title"><i style={{background:stage.color}}/><h2>{stage.label}</h2><span>{filtered.filter(l=>l.status===stage.id).length}</span></div><div className="desk-cards">{filtered.filter(l=>l.status===stage.id).map(lead=><button className="desk-card" key={lead.id} onClick={()=>open(lead)}><div className="desk-card-top"><span className="desk-package">{packages[lead.package]}</span><ArrowUpRight size={16}/></div><h3>{lead.name}</h3><p>{lead.area} м² <span>·</span> {lead.contact}</p><div className="desk-card-foot"><strong>{money(lead.amount)}</strong><span>{date(lead.createdAt)}</span></div>{lead.note&&<div className="desk-note-preview">{lead.note}</div>}</button>)}{!filtered.some(l=>l.status===stage.id)&&<div className="desk-column-empty">Здесь появятся заявки</div>}</div></section>)}</div>:<div className="desk-table-wrap"><table className="desk-table"><thead><tr><th>Клиент</th><th>Пакет / площадь</th><th>Этап</th><th>Сумма</th><th>Создана</th></tr></thead><tbody>{filtered.map(lead=><tr key={lead.id}><td><button onClick={()=>open(lead)}>{lead.name}<small>{lead.contact}</small></button></td><td>{packages[lead.package]}<small>{lead.area} м²</small></td><td><span className="desk-status"><i style={{background:stages.find(s=>s.id===lead.status)?.color}}/>{stages.find(s=>s.id===lead.status)?.label}</span></td><td>{money(lead.amount)}</td><td>{date(lead.createdAt)}</td></tr>)}</tbody></table></div>}
      <footer className="desk-footer">ПОТОК / CRM ДЛЯ СТУДИИ<span>Суммы заявок — расчётная стоимость, не полученный доход.</span></footer></section>
    </main>
    {(creating||current)&&<div className="desk-overlay" onClick={close}><section className="desk-panel" role="dialog" aria-modal="true" aria-labelledby="desk-panel-title" onClick={e=>e.stopPropagation()}><header><span className="desk-eyebrow">{creating?"НОВЫЙ КОНТАКТ":"КАРТОЧКА ЗАЯВКИ"}</span><button aria-label="Закрыть карточку" disabled={busy} onClick={close}><X size={22}/></button></header><h2 id="desk-panel-title">{creating?"Новая заявка":current?.name}</h2>{creating?<form onSubmit={e=>{e.preventDefault();const d=new FormData(e.currentTarget);void mutate({name:d.get("name"),contact:d.get("contact"),area:Number(d.get("area")),package:d.get("package"),note:d.get("note")},"POST");}}><label>Имя клиента<input name="name" required minLength={2} maxLength={100} autoFocus placeholder="Как обращаться к клиенту"/></label><label>Телефон или email<input name="contact" required minLength={5} maxLength={150} placeholder="Контакт для связи"/></label><div className="desk-form-row"><label>Площадь, м²<input name="area" type="number" required min={20} max={500} defaultValue={65}/></label><label>Пакет<select name="package" defaultValue="full">{Object.entries(packages).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label></div><label>Заметка<textarea name="note" rows={5} maxLength={2000} placeholder="Пожелания, сроки, следующий шаг"/></label><p className="desk-form-hint">Стоимость рассчитается по выбранному пакету и площади. Заявка появится в колонке «Новые».</p>{formError&&<p className="desk-error" role="alert">{formError}</p>}<button disabled={busy} className="desk-primary" type="submit">{busy?<LoaderCircle size={17} className="desk-spin"/>:<Plus size={17}/>} {busy?"Сохраняем…":"Создать заявку"}</button></form>:current&&<form onSubmit={e=>{e.preventDefault();void mutate({id:current.id,status,note,name:current.name,contact:current.contact,area:current.area,package:current.package,createdAt:current.createdAt},"PATCH");}}><div className="desk-details"><div><span>Контакт</span><strong>{current.contact}</strong></div><div><span>Проект</span><strong>{packages[current.package]} · {current.area} м²</strong></div><div><span>Расчётная стоимость</span><strong>{money(current.amount)}</strong></div><div><span>Дата заявки</span><strong>{date(current.createdAt)}</strong></div></div><label>Этап<select value={status} onChange={e=>{setStatus(e.target.value as Status);setSaved(false);}}>{stages.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label><label>Заметка<textarea value={note} onChange={e=>{setNote(e.target.value);setSaved(false);}} maxLength={2000} rows={6} placeholder="Зафиксируйте договорённости и следующий шаг"/></label>{formError&&<p className="desk-error" role="alert">{formError}</p>}<button disabled={busy} className="desk-primary" type="submit">{busy?<LoaderCircle size={17} className="desk-spin"/>:<Check size={17}/>} {busy?"Сохраняем…":"Сохранить изменения"}</button>{saved&&<p className="desk-success" role="status">Изменения сохранены</p>}</form>}</section></div>}
  </div>;
}
