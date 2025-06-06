create table users
(
    id       int                                  not null
        primary key,
    username varchar(255)                         null,
    nickname varchar(255)                         null,
    start    timestamp  default CURRENT_TIMESTAMP not null,
    end      timestamp                            null,
    istry    tinyint(1) default 0                 not null,
    isdelete tinyint(1) default 0                 not null,
    active   tinyint(1) default 0                 not null
);

create table grouplist
(
    id       varchar(255)                             not null
        primary key,
    userid   int                                      null,
    username varchar(255)                             null,
    nickname varchar(255)                             null,
    active   tinyint(1)     default 0                 null,
    join_in  timestamp      default CURRENT_TIMESTAMP null,
    start    tinyint(1)     default 0                 null,
    echange  decimal(10, 2) default 7.20              null,
    constraint groupList_users_id_fk
        foreign key (userid) references users (id)
);

create table outusdt
(
    id           int auto_increment
        primary key,
    username     varchar(255)                         null,
    nickname     varchar(255)                         null,
    adminid      int                                  null,
    groupid      varchar(255)                         null,
    amount       decimal(10, 2)                       null,
    isrecordding tinyint(1) default 1                 not null,
    join_in      timestamp  default CURRENT_TIMESTAMP not null,
    messageid    int                                  null,
    constraint outusdt_grouplist_id_fk
        foreign key (groupid) references grouplist (id)
            on update cascade on delete cascade
);

create table recording
(
    id           int auto_increment
        primary key,
    name         varchar(255)                         null,
    username     varchar(255)                         null,
    groupid      varchar(255)                         null,
    adminid      int                                  null,
    amount       decimal(10, 2)                       null,
    exchange     decimal(10, 2)                       null,
    usdt         decimal(10, 2)                       null,
    isrecordding tinyint(1) default 1                 not null,
    join_in      timestamp  default CURRENT_TIMESTAMP not null,
    messageid    int                                  null,
    constraint recording_grouplist_id_fk
        foreign key (groupid) references grouplist (id)
            on update cascade on delete cascade
);

