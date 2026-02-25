import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ADDONS, FAQ, FEATURES, PLANS, type BillingPeriod, type FeatureKey, formatAddonPrice, formatPlanPrice } from '../data/pricing';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">{children}</span>;
}

function PeriodToggle({
  period,
  onChange,
}: {
  period: BillingPeriod;
  onChange: (p: BillingPeriod) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border p-1">
      <button
        className={cn('px-3 py-1.5 text-sm rounded-lg', period === 'monthly' && 'bg-black text-white')}
        onClick={() => onChange('monthly')}
        type="button"
      >
        Mensuel
      </button>
      <button
        className={cn('px-3 py-1.5 text-sm rounded-lg', period === 'yearly' && 'bg-black text-white')}
        onClick={() => onChange('yearly')}
        type="button"
      >
        Annuel
      </button>
    </div>
  );
}

function LimitLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function PricingPage() {
  const [period, setPeriod] = React.useState<BillingPeriod>('monthly');

  return (
    <>
      <Helmet>
        <title>Formules d’abonnement – A KI PRI SA YÉ</title>
      </Helmet>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 flex-wrap items-start justify-between sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight">Formules d’abonnement</h1>
                <p className="mt-2 text-neutral-600">
                  A KI PRI SA YÉ : une base de prix utile, vérifiable, et exploitable. Commence en gratuit, puis active
                  les capacités pro quand tu en as besoin.
                </p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Badge>Freemium</Badge>
                  <Badge>Options modulaires</Badge>
                  <Badge>Branchable Stripe/PayPal</Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PeriodToggle period={period} onChange={setPeriod} />
                {period === 'yearly' ? (
                  <span className="text-sm text-neutral-600">Remise annuelle appliquée</span>
                ) : (
                  <span className="text-sm text-neutral-600">Sans engagement annuel</span>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => {
                const price = formatPlanPrice(plan, period);
                const isFree = plan.pricing.monthly.amountCents === 0 && plan.pricing.yearly.amountCents === 0;
                const perLabel = period === 'monthly' ? '/mois' : '/an';
                const yearlyHint =
                  period === 'yearly' && plan.pricing.yearlyDiscountLabel ? plan.pricing.yearlyDiscountLabel : null;

                return (
                  <div key={plan.id} className={cn('rounded-2xl border p-5 shadow-sm', plan.recommended && 'border-black')}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold">{plan.name}</h2>
                          {plan.recommended && <Badge>Recommandé</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">{plan.tagline}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-semibold">{price}</div>
                        <div className="text-sm text-neutral-600">{isFree ? '' : perLabel}</div>
                      </div>
                      {yearlyHint && <div className="mt-1 text-sm text-neutral-600">{yearlyHint}</div>}
                    </div>

                    <a
                      href={plan.ctaHref}
                      className={cn(
                        'mt-4 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium',
                        plan.recommended ? 'bg-black text-white' : 'border bg-white hover:bg-neutral-50'
                      )}
                    >
                      {plan.ctaLabel}
                    </a>

                    <div className="mt-5 space-y-2">
                      <LimitLine
                        label="Scans / mois"
                        value={plan.limits.scansPerMonth === undefined ? 'Illimité' : String(plan.limits.scansPerMonth)}
                      />
                      <LimitLine
                        label="Exports / mois"
                        value={
                          plan.limits.exportsPerMonth === undefined ? 'Illimité' : String(plan.limits.exportsPerMonth)
                        }
                      />
                      <LimitLine
                        label="Territoires"
                        value={plan.limits.territories === undefined ? 'Illimité' : String(plan.limits.territories)}
                      />
                      {plan.limits.teamSeats !== undefined && (
                        <LimitLine label="Sièges équipe" value={String(plan.limits.teamSeats)} />
                      )}
                    </div>

                    <div className="mt-5 border-t pt-4">
                      <div className="text-sm font-medium">Inclus</div>
                      <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                        {plan.featureKeys.slice(0, 6).map((k) => (
                          <li key={k} className="flex gap-2">
                            <span className="mt-0.5">✓</span>
                            <span>{FEATURES[k].label}</span>
                          </li>
                        ))}
                      </ul>
                      {plan.featureKeys.length > 6 && (
                        <div className="mt-2 text-sm text-neutral-600">
                          +{plan.featureKeys.length - 6} autres fonctionnalités dans le comparatif.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold">Options</h3>
              <p className="mt-1 text-neutral-600">
                Active seulement ce dont tu as besoin. Les options sont cumulables selon le plan.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {ADDONS.map((addon) => (
                  <div key={addon.id} className="rounded-2xl border p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold">{addon.name}</div>
                        <div className="mt-1 text-sm text-neutral-600">{addon.description}</div>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {addon.appliesTo.map((p) => (
                            <Badge key={p}>Compatible: {p.toUpperCase()}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatAddonPrice(addon, period)}</div>
                        <div className="text-xs text-neutral-600">{period === 'monthly' ? '/mois' : '/an'}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/checkout?addon=${addon.id}&billing=${period}`}
                        className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
                      >
                        Ajouter
                      </a>
                      <a
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        Demander un devis
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold">Comparatif</h3>
              <div className="mt-4 overflow-x-auto rounded-2xl border">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Fonctionnalité</th>
                      {PLANS.map((p) => (
                        <th key={p.id} className="p-3 text-left font-medium">
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.entries(FEATURES) as Array<[FeatureKey, (typeof FEATURES)[FeatureKey]]>).map(([key, meta]) => (
                      <tr key={key} className="border-t">
                        <td className="p-3">
                          <div className="font-medium">{meta.label}</div>
                          {meta.description && <div className="text-xs text-neutral-600">{meta.description}</div>}
                        </td>
                        {PLANS.map((p) => {
                          const has = p.featureKeys.includes(key);
                          return <td key={p.id} className="p-3">{has ? '✓' : '—'}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold">FAQ</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {FAQ.map((item) => (
                  <div key={item.q} className="rounded-2xl border p-5">
                    <div className="font-medium">{item.q}</div>
                    <div className="mt-2 text-sm text-neutral-700">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-2xl border p-6 bg-neutral-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Prêt à lancer la monétisation proprement</div>
                  <div className="mt-1 text-sm text-neutral-700">
                    On a l’UI, les plans, les options. Plus tard, on branche Stripe ou PayPal sans refaire cette page.
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 text-sm font-medium"
                    href="/signup"
                  >
                    Commencer gratuitement
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-white"
                    href="/contact"
                  >
                    Parler options / devis
                  </a>
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              Prix affichés en EUR. Exemple: Annuel = total sur 12 mois (remise incluse). Ajuste les montants dans
              <code className="mx-1">src/data/pricing.ts</code>.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
