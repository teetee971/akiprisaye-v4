import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ADDONS,
  FAQ,
  FEATURES,
  PLANS,
  type BillingPeriod,
  type FeatureKey,
  formatAddonPrice,
  formatMonthlyEquivalentFromYearlyCents,
  formatPlanPrice,
} from '../data/pricing';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-xs text-neutral-700">
      {children}
    </span>
  );
}

function PeriodToggle({
  period,
  onChange,
}: {
  period: BillingPeriod;
  onChange: (p: BillingPeriod) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-neutral-200 bg-white p-1">
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
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  );
}

export default function PricingPage() {
  const [period, setPeriod] = React.useState<BillingPeriod>('monthly');

  return (
    <>
      <Helmet>
        <title>Formules d’abonnement – A KI PRI SA YÉ</title>
        <meta
          name="description"
          content="Formules gratuit, pro et business, avec options modulaires (API, OCR, exports, support). Prix mensuel ou annuel avec remise."
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 items-start justify-between sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight">Abonnements & Options</h1>
                <p className="mt-2 text-neutral-600">
                  Commence en gratuit. Active ensuite Pro/Business selon ton niveau d’exploitation (analyses, alertes,
                  API, exports, multi-territoires).
                </p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Badge>Freemium</Badge>
                  <Badge>Options modulaires</Badge>
                  <Badge>Checkout prêt</Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PeriodToggle period={period} onChange={setPeriod} />
                <span className="text-sm text-neutral-600">
                  {period === 'yearly' ? 'Remise annuelle (2 mois off)' : 'Paiement mensuel'}
                </span>
              </div>
            </div>

            {/* Plans */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => {
                const price = formatPlanPrice(plan, period);
                const isFree = plan.pricing.monthly.amountCents === 0 && plan.pricing.yearly.amountCents === 0;
                const perLabel = period === 'monthly' ? '/mois' : '/an';
                const yearlyHint =
                  period === 'yearly' && plan.pricing.yearlyDiscountLabel ? plan.pricing.yearlyDiscountLabel : null;

                const yearlyEq =
                  period === 'yearly' && !isFree
                    ? formatMonthlyEquivalentFromYearlyCents(plan.pricing.yearly.amountCents)
                    : null;

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      'rounded-2xl border p-5 shadow-sm',
                      plan.recommended ? 'border-black' : 'border-neutral-200'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-neutral-900">{plan.name}</h2>
                          {plan.recommended && <Badge>Recommandé</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">{plan.tagline}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-semibold text-neutral-900">{price}</div>
                        <div className="text-sm text-neutral-600">{isFree ? '' : perLabel}</div>
                      </div>

                      {period === 'yearly' && yearlyEq && (
                        <div className="mt-1 text-sm text-neutral-600">
                          Équiv. <span className="font-medium text-neutral-900">{yearlyEq}</span>/mois (sur 12 mois)
                        </div>
                      )}

                      {yearlyHint && <div className="mt-1 text-sm text-neutral-600">{yearlyHint}</div>}
                    </div>

                    <a
                      href={plan.ctaHref}
                      className={cn(
                        'mt-4 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium',
                        plan.recommended ? 'bg-black text-white' : 'border border-neutral-200 bg-white hover:bg-neutral-50'
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

                    <div className="mt-5 border-t border-neutral-200 pt-4">
                      <div className="text-sm font-medium text-neutral-900">Inclus</div>
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

            {/* Addons */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-neutral-900">Options</h3>
              <p className="mt-1 text-neutral-600">
                Modules additionnels. L’annuel applique la même logique de remise (total annuel = 10 mois).
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {ADDONS.map((addon) => (
                  <div key={addon.id} className="rounded-2xl border border-neutral-200 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-neutral-900">{addon.name}</div>
                        <div className="mt-1 text-sm text-neutral-600">{addon.description}</div>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {addon.appliesTo.map((p) => (
                            <Badge key={p}>Compatible: {p.toUpperCase()}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-neutral-900">{formatAddonPrice(addon, period)}</div>
                        <div className="text-xs text-neutral-600">{period === 'monthly' ? '/mois' : '/an'}</div>
                        {period === 'yearly' && addon.pricing.yearly.amountCents > 0 && (
                          <div className="mt-1 text-xs text-neutral-600">
                            Équiv. {formatMonthlyEquivalentFromYearlyCents(addon.pricing.yearly.amountCents)}/mois
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/checkout?addon=${addon.id}&billing=${period}`}
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50"
                      >
                        Ajouter
                      </a>
                      <a
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        Devis / institution
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison table */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-neutral-900">Comparatif</h3>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="p-3 text-left font-medium text-neutral-900">Fonctionnalité</th>
                      {PLANS.map((p) => (
                        <th key={p.id} className="p-3 text-left font-medium text-neutral-900">
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.entries(FEATURES) as Array<[FeatureKey, (typeof FEATURES)[FeatureKey]]>).map(([key, meta]) => (
                      <tr key={key} className="border-t border-neutral-200">
                        <td className="p-3">
                          <div className="font-medium text-neutral-900">{meta.label}</div>
                          {meta.description && <div className="text-xs text-neutral-600">{meta.description}</div>}
                        </td>
                        {PLANS.map((p) => {
                          const has = p.featureKeys.includes(key);
                          return (
                            <td key={p.id} className="p-3 text-neutral-900">
                              {has ? '✓' : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-neutral-900">FAQ</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {FAQ.map((item) => (
                  <div key={item.q} className="rounded-2xl border border-neutral-200 p-5">
                    <div className="font-medium text-neutral-900">{item.q}</div>
                    <div className="mt-2 text-sm text-neutral-700">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-10 rounded-2xl border border-neutral-200 p-6 bg-neutral-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-neutral-900">Monétisation prête, intégration paiement ensuite</div>
                  <div className="mt-1 text-sm text-neutral-700">
                    L’UI et les calculs sont en place. Tu branches Stripe/PayPal plus tard, sans refaire cette page.
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 text-sm font-medium"
                    href="/signup"
                  >
                    Commencer gratuit
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-sm hover:bg-white"
                    href="/contact"
                  >
                    Contact / Devis
                  </a>
                </div>
              </div>

              <div className="mt-3 text-xs text-neutral-500">
                Convention: annuel = total payé en 1 fois avec remise (10× mensuel). Équivalent mensuel affiché = total annuel / 12.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
