"use client";
import { TopBar, SectionHead } from "@/components/Brand";

export default function ReceiptPreviewPage() {
  const subtotal = 850;
  const service = 45;
  const subT = subtotal + service;
  const vat = Math.round((subT * 7) / 107); // VAT-inclusive
  const ex = subT - vat;
  const total = subT;

  return (
    <div className="relative pb-10">
      <TopBar back="/" title="RECEIPT PREVIEW" />

      <div className="px-5 pt-6">
        <SectionHead
          eyebrow="DEV · TAX INVOICE"
          title="Receipt & e-Tax."
          hint="Thai-market layout. Printable. VAT 7% included. Pre-Leceipt / OneTax wiring."
        />

        {/* paper */}
        <div className="mt-6 bg-bone text-ink p-6 border border-bone/30 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-impact text-[20px] tracking-[0.05em]">LADDERICE × NIKE FB</div>
              <div className="font-mono text-[10px] text-ink/55 tracking-[0.18em] mt-0.5">
                BANGKOK · TIN 0-1055-12345-67-8
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[9.5px] tracking-[0.22em] text-ink/55">TAX INVOICE</div>
              <div className="font-impact text-[14px] mt-0.5">No. TI-2026-001284</div>
            </div>
          </div>

          <div className="mt-4 border-t border-dashed border-ink/30 pt-3 grid grid-cols-2 gap-3 font-mono text-[10.5px] tracking-[0.14em]">
            <div>
              <div className="text-ink/55">BUYER</div>
              <div className="mt-1 text-ink">SIRA SASITORN</div>
              <div className="text-ink/65">sira@turfmapp.com</div>
              <div className="text-ink/65">+66 81 234 5678</div>
            </div>
            <div className="text-right">
              <div className="text-ink/55">DATE</div>
              <div className="mt-1 text-ink">13 MAY 2026 · 18:42</div>
              <div className="text-ink/55 mt-2">BOOKING</div>
              <div className="text-ink">MG-K3X9P2</div>
            </div>
          </div>

          <div className="mt-5 border-t border-ink/20" />

          {/* line items */}
          <div className="mt-3">
            <div className="grid grid-cols-[1fr_auto] font-mono text-[10px] tracking-[0.22em] text-ink/55">
              <span>ITEM</span><span>AMOUNT</span>
            </div>
            <div className="mt-2 space-y-2">
              <Line label="Silk &amp; Stitch — workshop · ×1" sub="SAT 13 JUN · Shift A · 09:00–18:00" amount={850} />
              <Line label="Service fee" amount={45} />
            </div>
          </div>

          <div className="mt-5 border-t border-dashed border-ink/30" />

          <div className="mt-3 space-y-1.5 font-mono text-[11px] tracking-[0.12em]">
            <Row label="SUB-TOTAL (EX. VAT)" value={"฿" + ex.toLocaleString()} />
            <Row label="VAT 7%" value={"฿" + vat.toLocaleString()} />
            <Row label="TOTAL" value={"฿" + total.toLocaleString()} bold />
          </div>

          <div className="mt-5 border-t border-ink/20 pt-3 font-mono text-[9.5px] tracking-[0.18em] text-ink/55 leading-snug">
            PAID · OMISE · VISA •••• 4242<br />
            Thank you. Keep this receipt for entry verification.
          </div>

          {/* fake watermark */}
          <div className="mt-4 text-center font-display italic text-[14px] text-ink/40">
            แม๊ดโกดัง · 狂仓 · MAD GODOWN · BKK
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={() => window.print()} className="btn-volt">PRINT</button>
          <button onClick={() => alert("Mock — would generate signed PDF")} className="btn-ghost">DOWNLOAD PDF</button>
        </div>

        <div className="mt-5 font-mono text-[10px] tracking-[0.18em] text-bone/40 leading-snug">
          PROD WIRING → e-Tax via Leceipt / OneTax · monthly file to RD · attach to booking record
        </div>
      </div>
    </div>
  );
}

function Line({ label, sub, amount }: { label: string; sub?: string; amount: number }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
      <div>
        <div className="font-sans text-[13px] text-ink/90 leading-snug" dangerouslySetInnerHTML={{ __html: label }} />
        {sub && <div className="font-mono text-[10px] text-ink/55 mt-0.5 tracking-[0.14em]">{sub}</div>}
      </div>
      <div className="font-impact text-[15px] whitespace-nowrap">฿{amount.toLocaleString()}</div>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-ink/65">{label}</span>
      <span className={bold ? "font-impact text-[18px]" : "font-impact text-[13px]"}>{value}</span>
    </div>
  );
}
