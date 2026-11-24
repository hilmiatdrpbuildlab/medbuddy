import React, { useState } from 'react';
import { LayoutChangeEvent, Text, TextStyle, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { brand } from '@/config/brand';
import type { BriefModel } from '@/lib/brief';
import { useTheme } from '@/theme';

/**
 * The one-page GP Brief drawn as a true A4 sheet (595 × 842 pt), scaled to the available width.
 * Mirrors briefHtml() so what the user previews is what the doctor receives.
 */
export function BriefSheet({ b, showQr = true }: { b: BriefModel; showQr?: boolean }) {
  const { c } = useTheme();
  const [w, setW] = useState(0);
  const k = w / 595;
  const s = (n: number) => n * k;
  const teal = brand.colors.primary;
  const ink = c.paperInk;
  const ink2 = c.paperInk2;
  const rule = c.paperRule;
  const txt = (size: number, extra: TextStyle = {}): TextStyle => ({ fontSize: s(size), lineHeight: s(size * 1.38), color: ink, fontVariant: ['tabular-nums'], ...extra });
  const th = (extra: TextStyle = {}) => txt(7.5, { color: ink2, fontWeight: '700', letterSpacing: s(0.4), ...extra });
  const L = b.labels;

  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      accessibilityLabel={`${b.title}, ${b.patientName}`}
      style={{
        width: '100%',
        aspectRatio: 595 / 842,
        backgroundColor: c.paper,
        borderRadius: 4,
        shadowColor: '#0B2A2E',
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
        overflow: 'hidden',
      }}
    >
      {w > 0 && (
        <View style={{ padding: s(40), paddingTop: s(42), flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: s(2), borderColor: teal, paddingBottom: s(8) }}>
            <View>
              <Text style={txt(17, { color: teal, fontWeight: '700' })}>{b.title}</Text>
              <Text style={txt(9, { color: ink2 })}>{b.reportsLine}</Text>
            </View>
            <Text style={txt(10, { color: teal, fontWeight: '700' })}>{brand.name}</Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: s(10), gap: s(16) }}>
            {[
              [L.patient, b.patientName],
              [L.born, b.born],
              [L.visit, b.visit],
              [L.generated, b.generated],
            ].map(([k1, v]) => (
              <View key={k1}>
                <Text style={th()}>{k1.toUpperCase()}</Text>
                <Text style={txt(9.5)}>{v}</Text>
              </View>
            ))}
          </View>

          <Text style={txt(10, { color: teal, fontWeight: '700', marginTop: s(16), marginBottom: s(4), letterSpacing: s(0.6) })}>{L.labs.toUpperCase()}</Text>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: rule, paddingBottom: s(3) }}>
            <Text style={[th(), { flex: 2.3 }]}>{L.test.toUpperCase()}</Text>
            <Text style={[th({ textAlign: 'right' }), { flex: 1.8 }]}>{L.result.toUpperCase()}</Text>
            <Text style={[th({ textAlign: 'right' }), { flex: 1.3 }]}>{L.range.toUpperCase()}</Text>
            <Text style={[th({ textAlign: 'right' }), { flex: 1.9 }]}>{L.previous.toUpperCase()}</Text>
          </View>
          {b.labs.map((l) => (
            <View key={l.id} style={{ flexDirection: 'row', paddingVertical: s(4), borderBottomWidth: 1, borderColor: '#EEF1F3' }}>
              <View style={{ flex: 2.3 }}>
                <Text style={txt(9.5)}>{l.name}</Text>
                <Text style={txt(7.5, { color: ink2 })}>
                  {l.date} · {l.lab}
                </Text>
              </View>
              <View style={{ flex: 1.8, alignItems: 'flex-end' }}>
                <Text style={txt(9.5, { fontWeight: l.flag !== 'within' ? '700' : '400' })}>{l.value}</Text>
                {l.flag !== 'within' && <Text style={txt(7.5, { color: '#8A4B00', fontWeight: '600' })}>{l.flag === 'below' ? `↓ ${L.below}` : `↑ ${L.above}`}</Text>}
              </View>
              <Text style={[txt(9, { color: ink2, textAlign: 'right' }), { flex: 1.3 }]}>{l.range}</Text>
              <Text style={[txt(9, { color: ink2, textAlign: 'right' }), { flex: 1.9 }]}>{l.previous ?? '—'}</Text>
            </View>
          ))}

          {b.metrics.length > 0 && (
            <>
              <Text style={txt(10, { color: teal, fontWeight: '700', marginTop: s(16), marginBottom: s(4), letterSpacing: s(0.6) })}>{L.wearables.toUpperCase()}</Text>
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: rule, paddingBottom: s(3) }}>
                <Text style={[th(), { flex: 2.6 }]} />
                <Text style={[th({ textAlign: 'right' }), { flex: 1.4 }]}>{L.recent.toUpperCase()}</Text>
                <Text style={[th({ textAlign: 'right' }), { flex: 1.4 }]}>{L.baseline.toUpperCase()}</Text>
                <Text style={[th({ textAlign: 'right' }), { flex: 1.2 }]}>{L.change.toUpperCase()}</Text>
              </View>
              {b.metrics.map((m) => (
                <View key={m.key} style={{ flexDirection: 'row', paddingVertical: s(4), borderBottomWidth: 1, borderColor: '#EEF1F3' }}>
                  <Text style={[txt(9.5), { flex: 2.6 }]}>
                    {m.name} <Text style={{ color: ink2 }}>· {m.source}</Text>
                  </Text>
                  <Text style={[txt(9.5, { textAlign: 'right' }), { flex: 1.4 }]}>{m.recent}</Text>
                  <Text style={[txt(9.5, { color: ink2, textAlign: 'right' }), { flex: 1.4 }]}>{m.baseline}</Text>
                  <Text style={[txt(9.5, { textAlign: 'right' }), { flex: 1.2 }]}>{m.delta}</Text>
                </View>
              ))}
            </>
          )}

          {b.questions.length > 0 && (
            <>
              <Text style={txt(10, { color: teal, fontWeight: '700', marginTop: s(16), marginBottom: s(4), letterSpacing: s(0.6) })}>{L.questions.toUpperCase()}</Text>
              {b.questions.map((q, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: s(6), marginBottom: s(3) }}>
                  <Text style={txt(9.5, { width: s(12) })}>{i + 1}.</Text>
                  <Text style={[txt(9.5), { flex: 1 }]}>{q}</Text>
                </View>
              ))}
            </>
          )}

          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', gap: s(12), alignItems: 'center', borderTopWidth: 1, borderColor: rule, paddingTop: s(8) }}>
            {showQr && <QRCode value={b.url} size={s(64)} color={ink} backgroundColor="#FFFFFF" ecl="L" />}
            <Text style={[txt(7.5, { color: ink2 }), { flex: 1 }]}>
              {L.disclaimer}
              {'\n'}
              {L.scan} · {b.token}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
