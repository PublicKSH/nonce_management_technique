const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const config = require('./config');
const constants = require('./constants');

const jwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.publicKey,
    algorithms: 'RS256'
};

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== constants.TOKEN_TYPE.ACCESS) {
            throw new Error('Invalid token type');
        }

        const data = payload.sub;

        if (!data) {
            return done(null, false)
        }

        done(null, data);

    } catch (err) {
        done(err, false);
    }
};

const jwtStrategy = new JWTStrategy(jwtConfig, jwtVerify);

module.exports = {
    jwtStrategy
};
