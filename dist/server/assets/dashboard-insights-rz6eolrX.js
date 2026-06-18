//#region src/lib/api/crm-metrics.ts
async function fetchCRMmetrics(period = null) {
	const url = `/api/crm/metrics${period ? `?period=${encodeURIComponent(period)}` : ""}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error(`CRM metrics request failed: ${response.status}`);
	const data = await response.json();
	if (data.success === false) throw new Error(data.error ?? "CRM metrics fetch failed");
	return data;
}
//#endregion
//#region src/lib/dashboard-insights.ts
var currencyFormatter = new Intl.NumberFormat("es-PA", {
	style: "currency",
	currency: "USD"
});
var MIN_SAMPLE_SIZE = 5;
var MIN_BASELINE = 3;
function getBestConvertingService(items) {
	if (!Array.isArray(items) || items.length === 0) return null;
	const samples = items.filter((item) => item.leads >= MIN_SAMPLE_SIZE);
	if (samples.length === 0) return null;
	const best = samples.reduce((current, next) => {
		if (!current) return next;
		if (next.conversionRate > current.conversionRate) return next;
		if (next.conversionRate === current.conversionRate && next.leads > current.leads) return next;
		return current;
	}, null);
	if (!best) return null;
	return {
		service: best.service,
		conversionRate: best.conversionRate,
		leads: best.leads,
		estimatedPipelineValue: best.estimatedPipelineValue
	};
}
function getBestConvertingSource(items) {
	if (!Array.isArray(items) || items.length === 0) return null;
	const samples = items.filter((item) => item.leads >= MIN_SAMPLE_SIZE);
	if (samples.length === 0) return null;
	const best = samples.reduce((current, next) => {
		if (!current) return next;
		if (next.conversionRate > current.conversionRate) return next;
		if (next.conversionRate === current.conversionRate && next.leads > current.leads) return next;
		return current;
	}, null);
	if (!best) return null;
	return {
		source: best.source,
		conversionRate: best.conversionRate,
		leads: best.leads
	};
}
function getHighestValueService(items) {
	if (!Array.isArray(items) || items.length === 0) return null;
	const best = items.reduce((current, next) => {
		if (!current) return next;
		if ((next.estimatedPipelineValue ?? 0) > (current.estimatedPipelineValue ?? 0)) return next;
		if ((next.estimatedPipelineValue ?? 0) === (current.estimatedPipelineValue ?? 0) && next.conversionRate > current.conversionRate) return next;
		return current;
	}, null);
	if (!best) return null;
	return {
		service: best.service,
		conversionRate: best.conversionRate,
		leads: best.leads,
		estimatedPipelineValue: best.estimatedPipelineValue
	};
}
function getFastestGrowingService(data) {
	if (!Array.isArray(data) || data.length === 0) return null;
	const pointsWithPeriod = data.filter((item) => typeof item.period === "string");
	if (pointsWithPeriod.length >= 2) {
		const periods = Array.from(new Set(pointsWithPeriod.map((item) => item.period))).sort();
		if (periods.length >= 2) {
			const previousPeriod = periods[periods.length - 2];
			const currentPeriod = periods[periods.length - 1];
			const previousMap = /* @__PURE__ */ new Map();
			const currentMap = /* @__PURE__ */ new Map();
			pointsWithPeriod.forEach((item) => {
				if (item.period === previousPeriod) previousMap.set(item.service, item.leads);
				if (item.period === currentPeriod) currentMap.set(item.service, item.leads);
			});
			let best = null;
			new Set([...previousMap.keys(), ...currentMap.keys()]).forEach((service) => {
				const previous = previousMap.get(service) ?? 0;
				const current = currentMap.get(service) ?? 0;
				if (previous < MIN_BASELINE) return;
				const growthPercent = (current - previous) / previous * 100;
				if (!best || growthPercent > best.growthPercent) best = {
					service,
					growthPercent
				};
			});
			return best;
		}
	}
	const grouped = /* @__PURE__ */ new Map();
	data.forEach((item) => {
		const entries = grouped.get(item.service) ?? [];
		entries.push(item);
		grouped.set(item.service, entries);
	});
	let bestGrowth = null;
	grouped.forEach((entries, service) => {
		if (entries.length < 2) return;
		const ordered = [...entries];
		const first = ordered[0];
		const last = ordered[ordered.length - 1];
		if (first.leads < MIN_BASELINE) return;
		const growthPercent = (last.leads - first.leads) / first.leads * 100;
		if (!bestGrowth || growthPercent > bestGrowth.growthPercent) bestGrowth = {
			service,
			growthPercent
		};
	});
	return bestGrowth;
}
//#endregion
export { getHighestValueService as a, getFastestGrowingService as i, getBestConvertingService as n, fetchCRMmetrics as o, getBestConvertingSource as r, currencyFormatter as t };
