### Cretae table with 'id' AUTO INCREMENT 'name' and 'email' use UNIQUE KEY  

```
CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(11) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id`),
  UNIQUE KEY `email_uniq` (`Email`)
  UNIQUE KEY `name_uniq` (`Name`)
)
```

### Password hashing use bcrypt :
- link : https://www.npmjs.com/package/bcrypt 

### JsonWebToken (JWT) :
- link : https://www.npmjs.com/package/jsonwebtoken

### connect to batabase using mysql npm (BTW gw pake docker untuk database)
- link docker documentation : https://www.docker.com/
- link mysql npm : https://www.npmjs.com/package/mysql