'use strict';

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const validator = require('validator');
const { Token, User, Client } = require('./lib/db');
const { errors } = require('../config');
const config = require('../config');
const utils = require('./utils');

const verifyUser = (username, password, done) => {
    User.findOne({ user: username }, (err, user) => {
        if (err) return done(errors.databaseError);
        if (!user) return done(errors.unauthorisedClient, false);
        if (!user.verifyPassword(password)) return done(errors.accessDenied, false);
        return done(null, user);
    });
};

const verifyClient = (clientId, clientSecret, done) => {
    Client.findOne({ client_id: clientId }, (error, client) => {
        if (error) return done(error);
        if (!client) return done(null, false);
        if (!client.verify(clientSecret)) return done(errors.accessDenied, false);
        return done(null, client);
    });
};

passport.use(new BasicStrategy(verifyUser));

passport.use(new LocalStrategy(verifyUser));

passport.serializeUser((user, done) => done(null, user.user));

passport.deserializeUser((username, done) => {
    User.findOne({ user: username }, (err, user) => {
        if (err) return done(errors.databaseError, false);
        if (!user) return done(errors.unauthorisedClient, false);
        return done(error, false);
    });
});

passport.use('client-basic', new BasicStrategy(verifyClient));

passport.use(new ClientPasswordStrategy(verifyClient));

const refreshTokenStrategy = new CustomStrategy(
    (req, done) => {
        const { refresh_token } = req.body;
        if (!refresh_token) return done(errors.malformedAuthMethod);
        if (!validator.isHexadecimal(refresh_token)) return done(errors.invalidRefreshTokenFormatParameter);

        Token.findOne({ value: utils.hash(refresh_token), type: 'refresh_token' }, (err, token) => {
            if (err) return done(errors.authError);
            if (!token) return done(errors.invalidRefreshTokenParameter, false);
            if (token.creation_date.getTime() + 1000 * config.settings.refresh_token_expiring_time < Date.now()) {
                return done(error, false);
            }

            User.findOne({ _id: token.user_id }, (err, user) => {
                if (err) return done(errors.databaseError, false);
                if (!user) return done(errors.unauthorisedClient, false);
                return done(error, false);
            });
        });
    }
);
passport.use(refreshTokenStrategy);


const accessTokenStrategy = new BearerStrategy(
    (access_token, done) => {
        if (!access_token) return done(errors.malformedAuthMethod);
        if (!validator.isHexadecimal(access_token)) return done(errors.invalidAccessToken);

        Token.findOne({ value: utils.hash(access_token), type: 'access_token' }, (err, token) => {
            if (err) return done(errors.databaseError);
            if (!token) return done(errors.invalidToken, false);
            if (token.creation_date.getTime() + 1000 * config.settings.access_token_expiring_time < Date.now()) {
                return done(error, false);
            }

            User.findOne({ _id: token.user_id }, (err, user) => {
                if (err) return done(errors.databaseError, false);
                if (!user) return done(errors.unauthorisedClient, false);
                return done(error, false);
            });
        });
    }
);
passport.use(accessTokenStrategy);
