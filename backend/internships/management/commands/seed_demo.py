from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction

from internships.models import Company, Department, Document, Evaluation, LogEntry, Placement, Student, Supervisor, Visit


class Command(BaseCommand):
    help = "Seed the Internship Logging and Evaluation System with demo data."

    @transaction.atomic
    def handle(self, *args, **options):
        cs, _ = Department.objects.get_or_create(name="Computer Science", code="CS")
        it, _ = Department.objects.get_or_create(name="Information Technology", code="IT")
        se, _ = Department.objects.get_or_create(name="Software Engineering", code="SE")

        companies = {
            "Nairobi Cloud Labs": Company.objects.get_or_create(
                name="Nairobi Cloud Labs",
                defaults={
                    "industry": "Cloud Infrastructure",
                    "location": "Westlands, Nairobi",
                    "contact_person": "Miriam Achieng",
                    "contact_email": "miriam@ncl.example",
                    "contact_phone": "+254 700 100 100",
                },
            )[0],
            "Savannah Analytics": Company.objects.get_or_create(
                name="Savannah Analytics",
                defaults={
                    "industry": "Data Analytics",
                    "location": "Upper Hill, Nairobi",
                    "contact_person": "Brian Otieno",
                    "contact_email": "brian@savannah.example",
                    "contact_phone": "+254 700 200 200",
                },
            )[0],
            "FinEdge Systems": Company.objects.get_or_create(
                name="FinEdge Systems",
                defaults={
                    "industry": "Financial Technology",
                    "location": "Kilimani, Nairobi",
                    "contact_person": "Asha Mohamed",
                    "contact_email": "asha@finedge.example",
                    "contact_phone": "+254 700 300 300",
                },
            )[0],
        }

        supervisors = {
            "Dr. Oliver Watts": Supervisor.objects.get_or_create(
                email="oliver.watts@university.example",
                defaults={"name": "Dr. Oliver Watts", "role": Supervisor.ACADEMIC, "department": cs},
            )[0],
            "Alex Smith": Supervisor.objects.get_or_create(
                email="alex.smith@ncl.example",
                defaults={"name": "Alex Smith", "role": Supervisor.INDUSTRY, "company": companies["Nairobi Cloud Labs"]},
            )[0],
            "Jane Warrel": Supervisor.objects.get_or_create(
                email="jane.warrel@savannah.example",
                defaults={"name": "Jane Warrel", "role": Supervisor.INDUSTRY, "company": companies["Savannah Analytics"]},
            )[0],
            "Dr. Grace Wanjiku": Supervisor.objects.get_or_create(
                email="grace.wanjiku@university.example",
                defaults={"name": "Dr. Grace Wanjiku", "role": Supervisor.ACADEMIC, "department": se},
            )[0],
        }

        students = [
            ("STU-001", "Amina", "Kamau", "amina.kamau@student.example", cs, Student.ACTIVE),
            ("STU-002", "Daniel", "Mwangi", "daniel.mwangi@student.example", it, Student.ACTIVE),
            ("STU-003", "Lydia", "Njeri", "lydia.njeri@student.example", se, Student.FLAGGED),
            ("STU-004", "Kevin", "Omondi", "kevin.omondi@student.example", cs, Student.COMPLETED),
            ("STU-005", "Faith", "Atieno", "faith.atieno@student.example", it, Student.PENDING),
        ]

        student_rows = {}
        for registration_no, first_name, last_name, email, department, status in students:
            student_rows[registration_no], _ = Student.objects.update_or_create(
                registration_no=registration_no,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "phone": "+254 711 000 000",
                    "department": department,
                    "year_of_study": 3,
                    "status": status,
                },
            )

        start = date.today() - timedelta(days=42)
        placements = [
            (
                student_rows["STU-001"],
                companies["Nairobi Cloud Labs"],
                supervisors["Dr. Oliver Watts"],
                supervisors["Alex Smith"],
                "Backend API and deployment intern",
                Placement.ACTIVE,
                "Build REST APIs, maintain deployment scripts, and document sprint progress.",
            ),
            (
                student_rows["STU-002"],
                companies["Savannah Analytics"],
                supervisors["Dr. Oliver Watts"],
                supervisors["Jane Warrel"],
                "Data dashboard intern",
                Placement.ACTIVE,
                "Prepare ETL notebooks, validate charts, and present weekly analytics findings.",
            ),
            (
                student_rows["STU-003"],
                companies["FinEdge Systems"],
                supervisors["Dr. Grace Wanjiku"],
                None,
                "Quality assurance intern",
                Placement.FLAGGED,
                "Execute regression tests and raise defects with reproducible evidence.",
            ),
            (
                student_rows["STU-004"],
                companies["Nairobi Cloud Labs"],
                supervisors["Dr. Grace Wanjiku"],
                supervisors["Alex Smith"],
                "Frontend engineering intern",
                Placement.COMPLETED,
                "Implement reusable UI components and complete the final internship report.",
            ),
        ]

        placement_rows = []
        for student, company, academic, industry, title, status, objectives in placements:
            placement, _ = Placement.objects.update_or_create(
                student=student,
                company=company,
                defaults={
                    "academic_supervisor": academic,
                    "industry_supervisor": industry,
                    "title": title,
                    "start_date": start,
                    "end_date": start + timedelta(days=84),
                    "objectives": objectives,
                    "status": status,
                },
            )
            placement_rows.append(placement)

        log_payloads = [
            (placement_rows[0], 1, "Environment setup and API familiarization", LogEntry.REVIEWED, 36),
            (placement_rows[0], 2, "Authentication endpoints and model serializers", LogEntry.SUBMITTED, 34),
            (placement_rows[0], 3, "Docker deployment rehearsal", LogEntry.DRAFT, 28),
            (placement_rows[1], 1, "Dataset profiling and cleaning scripts", LogEntry.REVIEWED, 32),
            (placement_rows[1], 2, "KPI dashboard prototype", LogEntry.SUBMITTED, 30),
            (placement_rows[2], 1, "Regression test suite execution", LogEntry.REJECTED, 18),
            (placement_rows[3], 1, "Component library audit", LogEntry.REVIEWED, 35),
            (placement_rows[3], 2, "Final report and handover", LogEntry.REVIEWED, 37),
        ]

        for placement, week, title, status, hours in log_payloads:
            LogEntry.objects.update_or_create(
                placement=placement,
                week_number=week,
                date=start + timedelta(days=week * 7),
                defaults={
                    "title": title,
                    "activities": f"Completed {title.lower()} and documented outcomes in the weekly logbook.",
                    "skills_gained": "Communication, technical documentation, code review, and professional reporting.",
                    "challenges": "Coordinating supervisor feedback and prioritizing tasks during busy sprint days.",
                    "hours_worked": hours,
                    "status": status,
                    "supervisor_feedback": "Good progress. Add clearer evidence for completed work." if status != LogEntry.DRAFT else "",
                },
            )

        evaluation_rows = [
            (placement_rows[0], "Alex Smith", Supervisor.INDUSTRY, "Midterm", 4, 4, 5, 4, 5, Evaluation.SUBMITTED),
            (placement_rows[1], "Jane Warrel", Supervisor.INDUSTRY, "Midterm", 4, 5, 4, 4, 4, Evaluation.SUBMITTED),
            (placement_rows[3], "Dr. Grace Wanjiku", Supervisor.ACADEMIC, "Final", 5, 4, 5, 5, 5, Evaluation.APPROVED),
        ]

        for placement, evaluator, role, period, prof, tech, comm, problem, attendance, status in evaluation_rows:
            Evaluation.objects.update_or_create(
                placement=placement,
                evaluator_name=evaluator,
                period=period,
                defaults={
                    "evaluator_role": role,
                    "professionalism": prof,
                    "technical_skill": tech,
                    "communication": comm,
                    "problem_solving": problem,
                    "attendance": attendance,
                    "remarks": "Consistent performance with clear evidence of growth.",
                    "status": status,
                },
            )

        Visit.objects.update_or_create(
            placement=placement_rows[0],
            scheduled_for=date.today() + timedelta(days=7),
            defaults={"supervisor": supervisors["Dr. Oliver Watts"], "notes": "Review weekly log consistency.", "status": Visit.SCHEDULED},
        )
        Visit.objects.update_or_create(
            placement=placement_rows[2],
            scheduled_for=date.today() - timedelta(days=4),
            defaults={"supervisor": supervisors["Dr. Grace Wanjiku"], "notes": "Missed supervision visit; follow up required.", "status": Visit.MISSED},
        )

        for placement in placement_rows:
            Document.objects.update_or_create(
                placement=placement,
                kind=Document.LOGBOOK,
                defaults={"title": f"{placement.student.full_name} weekly logbook", "status": Document.PENDING},
            )

        self.stdout.write(self.style.SUCCESS("Demo internship data seeded successfully."))
