"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricCategory = exports.MetricPeriod = void 0;
var MetricPeriod;
(function (MetricPeriod) {
    MetricPeriod["DAILY"] = "daily";
    MetricPeriod["WEEKLY"] = "weekly";
    MetricPeriod["MONTHLY"] = "monthly";
    MetricPeriod["YEARLY"] = "yearly";
})(MetricPeriod || (exports.MetricPeriod = MetricPeriod = {}));
var MetricCategory;
(function (MetricCategory) {
    MetricCategory["ATTENDANCE"] = "attendance";
    MetricCategory["REVENUE"] = "revenue";
    MetricCategory["ENGAGEMENT"] = "engagement";
    MetricCategory["SURVEY"] = "survey";
    MetricCategory["SPONSOR"] = "sponsor";
    MetricCategory["PERFORMANCE"] = "performance";
})(MetricCategory || (exports.MetricCategory = MetricCategory = {}));
