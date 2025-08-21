"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionStatus = exports.QuestionType = exports.SurveyStatus = exports.SurveyType = void 0;
var SurveyType;
(function (SurveyType) {
    SurveyType["POST_EVENT"] = "POST_EVENT";
    SurveyType["SPONSOR_FEEDBACK"] = "SPONSOR_FEEDBACK";
    SurveyType["GENERAL_FEEDBACK"] = "GENERAL_FEEDBACK";
})(SurveyType || (exports.SurveyType = SurveyType = {}));
var SurveyStatus;
(function (SurveyStatus) {
    SurveyStatus["DRAFT"] = "DRAFT";
    SurveyStatus["ACTIVE"] = "ACTIVE";
    SurveyStatus["INACTIVE"] = "INACTIVE";
    SurveyStatus["ARCHIVED"] = "ARCHIVED";
})(SurveyStatus || (exports.SurveyStatus = SurveyStatus = {}));
var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "MULTIPLE_CHOICE";
    QuestionType["SINGLE_CHOICE"] = "SINGLE_CHOICE";
    QuestionType["TEXT"] = "TEXT";
    QuestionType["RATING"] = "RATING";
    QuestionType["SCALE"] = "SCALE";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
var DistributionStatus;
(function (DistributionStatus) {
    DistributionStatus["PENDING"] = "PENDING";
    DistributionStatus["SENT"] = "SENT";
    DistributionStatus["OPENED"] = "OPENED";
    DistributionStatus["COMPLETED"] = "COMPLETED";
    DistributionStatus["BOUNCED"] = "BOUNCED";
})(DistributionStatus || (exports.DistributionStatus = DistributionStatus = {}));
