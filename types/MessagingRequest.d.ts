import { ParamsDictionary, Query } from "express-serve-static-core";
import { Request } from "express";

export type MessagingWebhookBody = {
  MessageSid: string;
  AccountSid: string;
  ProfileName: string;
  Body: string;
  From: string;
  To: string;
};

export type MessagingRequest = Request<
  ParamsDictionary,
  any,
  MessagingWebhookBody,
  Query
>;
