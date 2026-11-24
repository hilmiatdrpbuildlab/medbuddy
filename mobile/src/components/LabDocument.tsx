import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LabReport, TESTS, flagFor, patient } from '@/data/labs';
import { fmtRange } from '@/lib/format';
import { useTheme } from '@/theme';

/**
 * A synthetic Belgian lab report, drawn as paper (always light, like the real document).
 * Kept in Dutch on purpose: it is the "source" the app translates from.
 */
const SECTIONS: { title: string; ids: string[] }[] = [
  { title: 'HEMATOLOGIE', ids: ['hb'] },
  { title: 'BIOCHEMIE', ids: ['glucose', 'hba1c', 'creat', 'crp', 'chol', 'ldl', 'hdl'] },
  { title: 'IJZERSTATUS & VITAMINES', ids: ['ferritin', 'vitd', 'b12'] },
  { title: 'ENDOCRINOLOGIE', ids: ['tsh'] },
];

const nlNum = (v: number, d: number) => v.toFixed(d).replace('.', ',');

export function LabDocument({
  report,
  highlight,
  scale = 1,
  onRowY,
}: {
  report: LabReport;
  highlight?: string | null;
  scale?: number;
  /** Reports each row's y offset within the document, so a parent can scroll to it. */
  onRowY?: (id: string, y: number) => void;
}) {
  const { c } = useTheme();
  const s = (n: number) => n * scale;
  const [secY] = useState<Record<string, number>>(() => ({}));
  const [rowY] = useState<Record<string, { sec: string; y: number }>>(() => ({}));
  const emit = (sec: string) => {
    for (const [id, r] of Object.entries(rowY)) if (r.sec === sec && secY[sec] != null) onRowY?.(id, secY[sec] + r.y);
  };
  const ink = c.paperInk;
  const ink2 = c.paperInk2;
  const date = report.date.split('-').reverse().join('/');
  const txt = (size: number, extra: object = {}) => ({ fontSize: s(size), lineHeight: s(size * 1.35), color: ink, ...extra });
  return (
    <View
      accessibilityLabel={`${report.lab}, ${date}`}
      style={{
        backgroundColor: c.paper,
        padding: s(18),
        borderRadius: 6,
        shadowColor: '#0B2A2E',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={txt(13, { fontWeight: '700', letterSpacing: 0.3 })}>{report.lab.toUpperCase()}</Text>
          <Text style={txt(8, { color: ink2 })}>{report.labAddress}</Text>
          <Text style={txt(8, { color: ink2 })}>Erkend laboratorium klinische biologie · Voorbeelddocument</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={txt(8, { color: ink2 })}>Staalnr. {report.sampleId}</Text>
          <Text style={txt(8, { color: ink2 })}>Afname {date}</Text>
        </View>
      </View>
      <View style={{ height: 1.5, backgroundColor: ink, marginVertical: s(8) }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={txt(9)}>
          <Text style={{ fontWeight: '700' }}>Patiënt: </Text>
          {patient.name.toUpperCase()} · °08/03/1992
        </Text>
        <Text style={txt(9)}>Aanvrager: {report.requester}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: s(10), paddingBottom: s(3), borderBottomWidth: StyleSheet.hairlineWidth, borderColor: c.paperRule }}>
        <Text style={[txt(7.5, { color: ink2, fontWeight: '700' }), { flex: 3.2 }]}>ANALYSE</Text>
        <Text style={[txt(7.5, { color: ink2, fontWeight: '700' }), { flex: 1.3, textAlign: 'right' }]}>RESULTAAT</Text>
        <Text style={[txt(7.5, { color: ink2, fontWeight: '700' }), { width: s(14) }]} />
        <Text style={[txt(7.5, { color: ink2, fontWeight: '700' }), { flex: 1.3 }]}>EENHEID</Text>
        <Text style={[txt(7.5, { color: ink2, fontWeight: '700' }), { flex: 1.6, textAlign: 'right' }]}>REFERENTIE</Text>
      </View>
      {SECTIONS.map((sec) => (
        <View key={sec.title} onLayout={(e) => {
          secY[sec.title] = e.nativeEvent.layout.y;
          emit(sec.title);
        }}>
          <Text style={txt(7.5, { fontWeight: '700', marginTop: s(7), marginBottom: s(2), letterSpacing: 0.4 })}>{sec.title}</Text>
          {sec.ids.map((id) => {
            const t = TESTS.find((x) => x.id === id)!;
            const v = report.values[id];
            const f = flagFor(t, v);
            const on = highlight === id;
            return (
              <View
                key={id}
                onLayout={(e) => {
                  rowY[id] = { sec: sec.title, y: e.nativeEvent.layout.y };
                  emit(sec.title);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: s(2.5),
                  paddingHorizontal: s(3),
                  marginHorizontal: -s(3),
                  borderRadius: 3,
                  backgroundColor: on ? 'rgba(242, 182, 73, 0.38)' : 'transparent',
                  borderWidth: on ? 1 : 0,
                  borderColor: on ? '#C98A1A' : 'transparent',
                }}
              >
                <Text style={[txt(9), { flex: 3.2 }]}>{t.sourceName}</Text>
                <Text style={[txt(9, { fontWeight: f !== 'within' ? '700' : '400', fontVariant: ['tabular-nums'] }), { flex: 1.3, textAlign: 'right' }]}>
                  {nlNum(v, t.decimals)}
                </Text>
                <Text style={[txt(8.5, { fontWeight: '700' }), { width: s(14), textAlign: 'center' }]}>{f === 'below' ? 'L' : f === 'above' ? 'H' : ''}</Text>
                <Text style={[txt(8.5, { color: ink2 }), { flex: 1.3 }]}>{t.unit}</Text>
                <Text style={[txt(8.5, { color: ink2 }), { flex: 1.6, textAlign: 'right' }]}>{fmtRange(t.low, t.high, t.decimals).replace(/\./g, ',')}</Text>
              </View>
            );
          })}
        </View>
      ))}
      <Text style={txt(7, { color: ink2, marginTop: s(10) })}>
        Gevalideerd door de klinisch bioloog. Fictief voorbeeld voor productdemonstratie — geen echte patiëntgegevens.
      </Text>
    </View>
  );
}
