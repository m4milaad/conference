import PageLayout from "./PageLayout";
import { Sparkles, Check, X, Shield, Medal, Trophy, Award } from "lucide-react";
import { useYear } from "../context/yearContext";
import conferenceData from "../content/conferenceData";

function Sponsors() {
  const { selectedYear } = useYear();
  const yearData = conferenceData[selectedYear];
  const sponsorsData = yearData?.sponsorship;

  if (!sponsorsData) {
    return (
      <PageLayout 
        title="Sponsors"
        subtitle={`Partnership opportunities for the ${selectedYear} International Conference on Applied Artificial Intelligence`}
      >
        <div className="linear-card p-12">
          <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
            <Sparkles size={64} className="text-[#c9a86a] mb-6" />
            <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-100 mb-4">
              Sponsorship Opportunities
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mb-6">
              We are working on creating exciting sponsorship packages for partners, organizations, and companies who want to be part of our conference.
            </p>
            <div className="inline-block bg-[#c9a86a]/10 border border-[#c9a86a]/30 text-[#c9a86a] font-medium px-6 py-3 rounded shadow-sm">
              Details will be announced soon
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const getTierIcon = (tierName) => {
    if (tierName.includes("Platinum")) return <Trophy className="text-[#E5E4E2] dark:text-zinc-300" size={32} />;
    if (tierName.includes("Gold")) return <Medal className="text-[#FFD700]" size={32} />;
    if (tierName.includes("Silver")) return <Award className="text-[#C0C0C0]" size={32} />;
    return <Shield className="text-[#CD7F32]" size={32} />;
  };

  return (
    <PageLayout 
      title="Sponsors"
      subtitle={`Sponsorship tiers and partnership benefits for the ${selectedYear} International Conference on Applied Artificial Intelligence`}
    >
      <div className="space-y-10">
        {/* Sponsor Logos */}
        {sponsorsData.sponsors && sponsorsData.sponsors.length > 0 && (
          <div className="linear-card overflow-hidden">
            <div className="p-6 border-b border-black/5 dark:border-white/5">
              <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100">Our Sponsors</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Organizations supporting the conference</p>
            </div>
            <div className="p-8">
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sponsorsData.sponsors.map((sponsor, idx) => (
                  <div
                    key={idx}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-black/[0.06] dark:border-white/10 bg-white dark:bg-white/5 p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#c9a86a]/40"
                  >
                    <div className="h-24 w-full flex items-center justify-center overflow-hidden rounded-lg bg-white p-3">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{sponsor.name}</p>
                      {sponsor.tier && (
                        <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-widest text-[#c9a86a]">
                          {sponsor.tier} Sponsor
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tier Cards */}
        {sponsorsData.tiers && sponsorsData.tiers.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sponsorsData.tiers.map((tier, idx) => (
            <div key={idx} className="linear-card group flex flex-col overflow-hidden transition-all hover:border-[#c9a86a]/40">
              <div className="p-6 text-center border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex justify-center mb-4 transition-transform group-hover:scale-110">
                  {getTierIcon(tier.name)}
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-100">{tier.name}</h3>
                <p className="mt-2 text-2xl font-black tracking-tight text-[#5E6AD2] dark:text-[#c9a86a]">{tier.amount}</p>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Available Slots</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 bg-black/5 dark:bg-white/10 px-2 py-0.5">{tier.slots}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Free Passes</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{tier.benefits["Conference passes"]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Benefits Comparison Table */}
        {sponsorsData.tiers && sponsorsData.benefitList && (
        <div className="linear-card overflow-hidden">
          <div className="p-6 border-b border-black/5 dark:border-white/5">
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100">Benefit Matrix</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Detailed comparison across all sponsorship tiers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <th className="px-6 py-4 border-b border-black/5 dark:border-white/5">Benefit</th>
                  {sponsorsData.tiers.map(t => (
                    <th key={t.name} className="px-6 py-4 border-b border-black/5 dark:border-white/5 text-center">{t.name.split(" ")[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                {sponsorsData.benefitList.map((benefit) => (
                  <tr key={benefit} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">{benefit}</td>
                    {sponsorsData.tiers.map(tier => {
                      const value = tier.benefits[benefit];
                      return (
                        <td key={tier.name} className="px-6 py-4 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="mx-auto text-green-600 dark:text-green-400" size={18} />
                            ) : (
                              <X className="mx-auto text-zinc-300 dark:text-zinc-700" size={18} />
                            )
                          ) : (
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        <div className="linear-card border border-[#c9a86a]/20 bg-[#c9a86a]/10 p-8 text-center">
          <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-100 mb-2 uppercase tracking-wide">Interested in Partnering?</h3>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-6">
            For more details on sponsorship opportunities, please contact the organizing committee at <span className="font-bold text-[#5E6AD2] dark:text-[#c9a86a]">appliedaiconf@gmail.com</span>
          </p>
          <a 
            href="mailto:appliedaiconf@gmail.com"
            className="linear-primary ui-focus-ring inline-flex items-center gap-2 px-8 py-3 text-xs font-bold uppercase tracking-widest"
          >
            Contact for Sponsorship
          </a>
        </div>
      </div>
    </PageLayout>
  );
}

export default Sponsors;

