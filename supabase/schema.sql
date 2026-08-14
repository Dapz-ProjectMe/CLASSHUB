create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_name text not null default 'X APAT 1',
  student_number integer,
  created_at timestamptz not null default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  day text not null check (day in ('senin','selasa','rabu','kamis','jumat')),
  start_time time not null,
  end_time time not null,
  subject text not null,
  teacher text,
  room text,
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published_at timestamptz not null default now(),
  active boolean not null default true
);

create table if not exists public.duty_rosters (
  id uuid primary key default gen_random_uuid(),
  day text not null check (day in ('senin','selasa','rabu','kamis','jumat')),
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists students_name_idx on public.students(name);
create index if not exists schedules_day_idx on public.schedules(day);
create index if not exists announcements_published_idx on public.announcements(published_at desc);
create index if not exists duty_day_idx on public.duty_rosters(day);

alter table public.students enable row level security;
alter table public.schedules enable row level security;
alter table public.announcements enable row level security;
alter table public.duty_rosters enable row level security;

drop policy if exists "public read students" on public.students;
create policy "public read students" on public.students for select using (true);

drop policy if exists "public read schedules" on public.schedules;
create policy "public read schedules" on public.schedules for select using (true);

drop policy if exists "public read announcements" on public.announcements;
create policy "public read announcements" on public.announcements for select using (active = true);

drop policy if exists "public read duty" on public.duty_rosters;
create policy "public read duty" on public.duty_rosters for select using (true);

-- Seed 36 students. Safe to re-run only if the table is empty.
insert into public.students (name, student_number)
select v.name, v.no
from (values
('Aditya Pratama',1),('Ahmad Fauzan',2),('Aldi Saputra',3),('Andika Wijaya',4),
('Bagas Ramadhan',5),('Bima Setiawan',6),('Cahyo Nugroho',7),('Daffa Nurkhalish',8),
('Dani Kurniawan',9),('Dimas Saputra',10),('Fajar Ramadhan',11),('Fauzan Akbar',12),
('Galang Pratama',13),('Hafiz Maulana',14),('Ilham Saputra',15),('Joko Susanto',16),
('Kevin Alvaro',17),('Lukman Hakim',18),('M. Rizky',19),('M. Fadli',20),
('Nanda Putra',21),('Naufal Ramadhan',22),('Noval Ardiansyah',23),('Putra Wijaya',24),
('Raka Aditya',25),('Rangga Saputra',26),('Reza Fahlevi',27),('Rizal Maulana',28),
('Salsa Putri',29),('Siti Aisyah',30),('Tasya Amelia',31),('Vina Lestari',32),
('Wahyu Hidayat',33),('Yogi Prasetyo',34),('Zaki Ramadhan',35),('Zulfan Akbar',36)
) as v(name,no)
where not exists (select 1 from public.students);

insert into public.schedules(day,start_time,end_time,subject,teacher,room)
select day, start_time::time, end_time::time, subject, teacher, room
from (values
('senin','07:00','08:30','Bahasa Indonesia','Bapak/Ibu Guru','X APAT 1'),
('senin','08:30','10:00','Matematika','Bapak/Ibu Guru','X APAT 1'),
('senin','10:15','11:45','Produktif APAT','Bapak/Ibu Guru','Lab APAT'),
('senin','12:30','14:00','Pendidikan Agama','Bapak/Ibu Guru','X APAT 1'),
('selasa','07:00','08:30','Bahasa Inggris','Bapak/Ibu Guru','X APAT 1'),
('selasa','08:30','10:00','Produktif APAT','Bapak/Ibu Guru','Lab APAT'),
('selasa','10:15','11:45','IPAS','Bapak/Ibu Guru','X APAT 1'),
('selasa','12:30','14:00','PJOK','Bapak/Ibu Guru','Lapangan'),
('rabu','07:00','08:30','Matematika','Bapak/Ibu Guru','X APAT 1'),
('rabu','08:30','10:00','Bahasa Inggris','Bapak/Ibu Guru','X APAT 1'),
('rabu','10:15','11:45','Produktif APAT','Bapak/Ibu Guru','Lab APAT'),
('rabu','12:30','14:00','Sejarah','Bapak/Ibu Guru','X APAT 1'),
('kamis','07:00','08:30','Bahasa Indonesia','Bapak/Ibu Guru','X APAT 1'),
('kamis','08:30','10:00','Produktif APAT','Bapak/Ibu Guru','Lab APAT'),
('kamis','10:15','11:45','Pendidikan Pancasila','Bapak/Ibu Guru','X APAT 1'),
('kamis','12:30','14:00','Seni Budaya','Bapak/Ibu Guru','X APAT 1'),
('jumat','07:00','08:30','Pendidikan Agama','Bapak/Ibu Guru','X APAT 1'),
('jumat','08:30','10:00','Bahasa Inggris','Bapak/Ibu Guru','X APAT 1'),
('jumat','10:15','11:45','Produktif APAT','Bapak/Ibu Guru','Lab APAT')
) x(day,start_time,end_time,subject,teacher,room)
where not exists (select 1 from public.schedules);

insert into public.announcements(title,body)
select * from (values
('Selamat Datang di CLASSHUB','CLASSHUB menjadi pusat informasi digital untuk seluruh anggota X APAT 1.'),
('Persiapan Kegiatan Kelas','Mohon seluruh siswa memperhatikan informasi kegiatan kelas yang akan datang.'),
('Jaga Kebersihan Kelas','Jangan lupa melaksanakan jadwal piket sesuai pembagian masing-masing.')
) x(title,body)
where not exists (select 1 from public.announcements);
