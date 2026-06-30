insert into tb_category (name) values ('Bolos');
insert into tb_category (name) values ('Doces');
insert into tb_category (name) values ('Salgados');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Fraisier', 'Massa génoise recheada com creme diplomate com morangos', 11.00, 1, '/img/fraisier.png', '/img/fraisier1.png', '/img/fraisier2.png', '/img/fraisier3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Gâteau moka', 'Massa génoise recheada com creme de manteiga de café e amêndoas', 13.00, 1, '/img/moka.png', '/img/moka1.png', '/img/moka2.png', '/img/moka3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Gâteau opéra', 'Entremet com biscuit amande e creme de manteiga e ganache de chocolate', 14.00, 1, '/img/opera.png', '/img/opera1.png', '/img/opera2.png', '/img/opera3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Bûche de Noël', 'Bolo tradicional francês em formato de tronco com creme e chocolate', 16.00, 1, '/img/buche.png', '/img/buche1.png', '/img/buche2.png', '/img/buche3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Crêpe suzette', 'Tradicional massa crepe regado com calda de tangerina e licor de laranja', 20.00, 2, '/img/crepe.png', '/img/crepe1.png', '/img/crepe2.png', '/img/crepe3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Pain au chocolat', 'Tradicional massa folhada recheada com chocolate', 20.00, 2, '/img/pain.png', '/img/pain1.png', '/img/pain2.png', '/img/pain3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Tarte tatin', 'Massa sablée recheada com maçãs caramelizadas e canela', 18.00, 2, '/img/tarte.png', '/img/tarte1.png', '/img/tarte2.png', '/img/tarte3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Éclair', 'Massa choux recheada com creme de confeiteiro e cobertura de chocolate', 15.00, 2, '/img/eclair.png', '/img/eclair1.png', '/img/eclair2.png', '/img/eclair3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Croissant', 'Tradicional pão croissant de massa folhada', 14.00, 3, '/img/croissant.png', '/img/croissant1.png', '/img/croissant2.png', '/img/croissant3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Fougasse', 'Pão Fougasse com tomate cereja, orégano e azeitonas', 16.00, 3, '/img/fougasse.png', '/img/fougasse1.png', '/img/fougasse2.png', '/img/fougasse3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Quiche lorraine', 'Quiche de massa sablée de queijo mussarela com bacon', 18.00, 3, '/img/quiche.png', '/img/quiche1.png', '/img/quiche2.png', '/img/quiche3.png');

insert into tb_product (name, description, price, category_id, image, mini1, mini2, mini3) values ('Croque monsieur', 'Sanduíche francês gratinado com presunto, queijo e molho bechamel', 17.00, 3, '/img/croque.png', '/img/croque1.png', '/img/croque2.png', '/img/croque3.png');

INSERT INTO tb_user(display_name, username, password) VALUES ('Administrador', 'admin', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');

INSERT INTO tb_user(display_name, username, password) VALUES ('Teste', 'test', '$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');