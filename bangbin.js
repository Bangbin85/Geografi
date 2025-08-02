        // --- DATA MAPPING ---
        let tujuanData = {
            iman: ["Menunjukkan keyakinan terhadap Tuhan YME", "Menghayati nilai-nilai akhlak mulia", "Menjaga hubungan harmonis", "Menghargai dan merawat lingkungan", "Mengembangkan sikap syukur dan sabar", "Menerapkan nilai-nilai keagamaan", "Berperilaku jujur, adil, dan bertanggung jawab"],
            warga: ["Menunjukkan rasa bangga terhadap identitas bangsa", "Menghargai keberagaman", "Menaati hukum dan norma", "Berpartisipasi menjaga persatuan", "Menerapkan prinsip hidup berkelanjutan", "Berkontribusi menjaga perdamaian", "Mengembangkan kesadaran hak dan kewajiban"],
            kritis: ["Mengembangkan rasa ingin tahu", "Menerapkan berpikir logis dan analitis", "Menganalisis informasi secara kritis", "Membangun argumen yang logis", "Memanfaatkan literasi dan numerasi", "Mengevaluasi berbagai solusi", "Mengidentifikasi bias dan kesalahan logika"],
            kreatif: ["Menghasilkan gagasan orisinal", "Mengembangkan produk inovatif", "Menerapkan berpikir divergen", "Memadukan berbagai disiplin ilmu", "Mengekspresikan ide", "Beradaptasi dengan perubahan", "Menerima umpan balik"],
            kolaborasi: ["Menunjukkan sikap peduli dan empati", "Bekerja sama dalam tim", "Berkomunikasi efektif dalam kelompok", "Membangun hubungan positif", "Berbagi sumber daya dan pengetahuan", "Menyelesaikan konflik secara konstruktif", "Berpartisipasi dalam kegiatan sosial"],
            mandiri: ["Bertanggung jawab atas tugas", "Mengambil inisiatif", "Beradaptasi dengan tantangan", "Mengelola waktu dan sumber daya", "Mengembangkan disiplin diri", "Meningkatkan problem-solving mandiri", "Membangun motivasi intrinsik"],
            sehat: ["Menerapkan pola hidup bersih dan sehat", "Memahami pentingnya kebugaran jasmani", "Mengenali tanda-tanda gangguan kesehatan", "Menjaga keseimbangan fisik dan mental", "Menghindari perilaku berisiko", "Berkontribusi menjaga kebersihan lingkungan", "Mengembangkan kebiasaan makan bergizi"],
            komunikasi: ["Menyimak dengan aktif", "Membaca secara kritis", "Berbicara dengan jelas dan santun", "Menulis dengan struktur yang baik", "Menggunakan media digital bertanggung jawab", "Menyesuaikan gaya komunikasi", "Menerapkan etika komunikasi"]
        };
        const valueMap = { SB: "Sangat Baik", B: "Baik", C: "Cukup", K: "Perlu Peningkatan" };
        const scoreMap = { SB: 4, B: 3, C: 2, K: 1 };
        const radioValues = ["SB", "B", "C", "K"];
        const headerBgClasses = ["header-aspek-1", "header-aspek-2", "header-aspek-3", "header-aspek-4", "header-aspek-5", "header-aspek-6"];
        const aspectBgClasses = ["bg-yellow-50/50", "bg-green-50/50", "bg-blue-50/50", "bg-purple-50/50", "bg-red-50/50", "bg-orange-50/50"];
        let importedStudentNames = [];
        const APP_STATE_KEY = 'kokurikulerAppState';

        // --- ELEMENT SELECTORS ---
        const tujuan1Select = document.getElementById('tujuan1-select');
        const tujuan2Select = document.getElementById('tujuan2-select');
        const tujuan3Select = document.getElementById('tujuan3-select');
        const tableBody = document.getElementById('student-table-body');
        const dimensiMultiSelectButton = document.getElementById('dimensi-multiselect-button');
        const dimensiMultiSelectPanel = document.getElementById('dimensi-multiselect-panel');
        const temaInput = document.getElementById('tema-input');

        // --- DYNAMIC DROPDOWN LOGIC ---
        function handleDimensionChange() {
            const selectedCheckboxes = Array.from(dimensiMultiSelectPanel.querySelectorAll('input[type="checkbox"]:checked'));
            const selectedDimensions = selectedCheckboxes.map(cb => cb.value);

            const buttonText = dimensiMultiSelectButton.querySelector('span');
            
            if (selectedDimensions.length === 0) {
                buttonText.textContent = '-- Pilih Dimensi --';
            } else {
                const selectedLabels = selectedCheckboxes.map(cb => cb.parentElement.textContent.replace("Edit", "").trim());
                buttonText.textContent = selectedLabels.join(', ');
            }

            let combinedObjectives = [];
            selectedDimensions.forEach(dimensi => {
                combinedObjectives.push(...(tujuanData[dimensi] || []));
            });
            
            const uniqueObjectives = [...new Set(combinedObjectives)];
            
            updateTujuanOptions(tujuan1Select, uniqueObjectives, 1);
            updateTujuanOptions(tujuan2Select, uniqueObjectives, 2);
            updateTujuanOptions(tujuan3Select, uniqueObjectives, 3);
            document.querySelectorAll('#student-table-body tr').forEach(updateCapaian);
            saveStateToLocalStorage();
        }

        function updateTujuanOptions(selectElement, options, number) {
            const currentValue = selectElement.value;
            selectElement.innerHTML = `<option value="">-- Pilih Tujuan ${number} --</option>`;
            options.forEach(optionText => {
                const option = document.createElement('option');
                const optionValue = optionText.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
                option.value = optionValue;
                option.textContent = optionText;
                selectElement.appendChild(option);
            });
            if (options.some(opt => opt.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30) === currentValue)) {
                selectElement.value = currentValue;
            }
        }
        
        function buildMultiSelectDimensi() {
            dimensiMultiSelectPanel.innerHTML = ''; // Clear before building
            const dimensionMap = {
                iman: "Keimanan dan Ketakwaan terhadap Tuhan YME", warga: "Kewargaan", kritis: "Penalaran Kritis",
                kreatif: "Kreativitas", kolaborasi: "Kolaborasi", mandiri: "Kemandirian",
                sehat: "Kesehatan", komunikasi: "Komunikasi"
            };

            Object.entries(dimensionMap).forEach(([key, text]) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'flex justify-between items-center p-1 rounded-md hover:bg-gray-100';
                
                const label = document.createElement('label');
                label.className = 'flex items-center gap-2 text-sm cursor-pointer flex-grow';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = key;
                checkbox.className = 'h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500';
                checkbox.addEventListener('change', handleDimensionChange);
                
                label.appendChild(checkbox);
                label.append(text);
                
                const editBtn = document.createElement('button');
                editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square text-gray-400 hover:text-sky-600"></i>`;
                editBtn.title = `Edit Tujuan ${text}`;
                editBtn.className = 'p-1 ml-2 flex-shrink-0';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    openEditTujuanModal(key, text);
                };

                itemDiv.appendChild(label);
                itemDiv.appendChild(editBtn);
                dimensiMultiSelectPanel.appendChild(itemDiv);
            });
        }

        dimensiMultiSelectButton.addEventListener('click', () => dimensiMultiSelectPanel.classList.toggle('hidden'));
        document.addEventListener('click', (e) => {
            if (!document.getElementById('dimensi-multiselect-container').contains(e.target)) {
                dimensiMultiSelectPanel.classList.add('hidden');
            }
        });

        // --- STUDENT TABLE GENERATION & ADDING ---
        const initialStudents = ["BINTANG ADHI PERMANA", "RIZAL LISTYO MAHARDIKA", "YOGA ADI PRATAMA", "DIDIK RAHMADI", "DHOY EDU", "MUSLIM MACKBOOK", "KEN AROK", "KEN DEDES", "IKA NIRMALA", "FABIO TAJ ZINEDINE ARAFFI", "FAHIRA DIWI AVIKA", "FAHMI ABDI MAULANA", "FERA KALLISTHA NAJMI", "Hasan Syafii Ma'arif", "IKLIL USAYD JAFNI", "IQBAL RAZIQ SYAFRIZAL", "MAHIRA ADINDA SYAHFITRI"];

        function addStudentRow(studentName = "Nama Siswa Baru", studentId = null, isInitial = false) {
            const newStudentId = studentId || crypto.randomUUID();
            const newRow = tableBody.insertRow();
            if (!isInitial) {
                newRow.className = 'new-row-animation';
            }
            newRow.dataset.studentId = newStudentId;
            
            const nameCell = newRow.insertCell();
            nameCell.className = `text-slate-700 font-semibold text-left p-2 md:p-3 sticky-col sticky-col-first cursor-text`;
            nameCell.contentEditable = true;
            nameCell.textContent = studentName;
            nameCell.addEventListener('blur', saveStateToLocalStorage); // Save on name change

            const aspekHeaders = document.querySelectorAll('#aspek-row th');
            aspekHeaders.forEach((th, index) => {
                const aspekInput = th.querySelector('input[data-aspek-id]');
                if (!aspekInput) return; // Skip if no input found (e.g., during deletion)
                const aspekId = aspekInput.dataset.aspekId;
                const bgColor = aspectBgClasses[index % aspectBgClasses.length];
                radioValues.forEach(val => {
                    const radioCell = newRow.insertCell();
                    radioCell.className = `${bgColor} p-2 text-center`;
                    radioCell.innerHTML = `<input type="radio" name="${newStudentId}-${aspekId}" data-value="${val}">`;
                });
            });

            const capaianCell = newRow.insertCell();
            capaianCell.className = `capaian-cell sticky-col sticky-col-last`;
            capaianCell.innerHTML = `<div class="capaian-input"></div>`;

            if (!isInitial) {
                nameCell.focus();
                document.execCommand('selectAll', false, null);
                saveStateToLocalStorage();
            }
        }
        
        document.getElementById('addStudentBtn').addEventListener('click', () => addStudentRow());

        // --- DYNAMIC ASPECT ADD/DELETE LOGIC ---
        document.querySelectorAll('.add-aspek-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tujuanNumber = e.currentTarget.dataset.tujuan;
                addAspek(tujuanNumber);
            });
        });

        function addAspek(tujuanNumber) {
            const aspekRow = document.getElementById('aspek-row');
            const penilaianRow = document.getElementById('penilaian-row');
            const tableBody = document.getElementById('student-table-body');

            const aspekHeaders = aspekRow.querySelectorAll(`th[data-tujuan="${tujuanNumber}"]`);
            
            const lastAspekHeader = aspekHeaders.length > 0 ? aspekHeaders[aspekHeaders.length - 1] : Array.from(aspekRow.cells).find(cell => cell.dataset.tujuan < tujuanNumber);
            const aspekCountForTujuan = aspekHeaders.length + 1;
            
            const totalPrecedingAspects = lastAspekHeader ? Array.from(aspekRow.cells).indexOf(lastAspekHeader) : -1;

            const lastPenilaianCellIndex = (totalPrecedingAspects + 1) * 4 -1;
            const refPenilaianCell = penilaianRow.cells[lastPenilaianCellIndex];

            const totalAspekCount = aspekRow.cells.length;
            const newAspekId = `aspek-${Date.now()}`;

            document.getElementById('tema-container').colSpan += 4;
            document.getElementById('dimensi-container').colSpan += 4;
            document.getElementById(`tujuan${tujuanNumber}-container`).colSpan += 4;

            const newAspekTh = document.createElement('th');
            newAspekTh.colSpan = 4;
            newAspekTh.className = 'whitespace-normal px-2 py-1';
            newAspekTh.dataset.tujuan = tujuanNumber;
            newAspekTh.innerHTML = `
                <div class="flex items-center gap-2">
                    <input type="text" data-aspek-id="${newAspekId}" placeholder="Aspek ${aspekCountForTujuan}" class="font-normal bg-white/70 border-slate-200 text-sm w-full p-2 rounded-md text-center flex-grow">
                    <button class="delete-aspek-btn bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex-shrink-0 flex items-center justify-center text-lg font-bold shadow-md transition transform hover:scale-110" title="Hapus Aspek Ini">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </div>
            `;
            if (lastAspekHeader) {
                lastAspekHeader.insertAdjacentElement('afterend', newAspekTh);
            } else {
                aspekRow.appendChild(newAspekTh);
            }
            
            newAspekTh.querySelector('.delete-aspek-btn').addEventListener('click', () => deleteAspek(newAspekTh));
            newAspekTh.querySelector('input').addEventListener('input', saveStateToLocalStorage);


            const headerBgColor = headerBgClasses[totalAspekCount % headerBgClasses.length];
            let currentRefCell = refPenilaianCell;
            radioValues.forEach(val => {
                const newPenilaianTh = document.createElement('th');
                newPenilaianTh.className = `header-aspek ${headerBgColor}`;
                newPenilaianTh.textContent = val;
                if(currentRefCell) {
                    currentRefCell.insertAdjacentElement('afterend', newPenilaianTh);
                } else {
                    penilaianRow.appendChild(newPenilaianTh);
                }
                currentRefCell = newPenilaianTh;
            });

            const radioBgClass = aspectBgClasses[totalAspekCount % aspectBgClasses.length];
            tableBody.querySelectorAll('tr').forEach(row => {
                const studentId = row.dataset.studentId;
                let refBodyCell = row.cells[lastPenilaianCellIndex + 1];
                radioValues.forEach(val => {
                    const newTd = document.createElement('td');
                    newTd.className = `${radioBgClass} p-2 text-center`;
                    newTd.innerHTML = `<input type="radio" name="${studentId}-${newAspekId}" data-value="${val}">`;
                    if(refBodyCell) {
                       refBodyCell.insertAdjacentElement('afterend', newTd);
                    } else {
                        // This case handles adding to an empty row, find the name cell and insert after it.
                        row.insertBefore(newTd, row.querySelector('.capaian-cell'));
                    }
                    refBodyCell = newTd;
                });
            });

            setStickyHeader();
            document.querySelectorAll('#student-table-body tr').forEach(updateCapaian);
            saveStateToLocalStorage();
        }

        function deleteAspek(aspekTh) {
            const aspekRow = document.getElementById('aspek-row');
            if (aspekRow.cells.length <= 1) { // Keep at least 1 aspect
                showInfoModal("Gagal Menghapus", "Harus ada minimal satu aspek penilaian.", true);
                return;
            }

            const aspekCells = Array.from(aspekRow.cells);
            const aspekIndex = aspekCells.indexOf(aspekTh);

            if (aspekIndex === -1) return;

            const tujuanNumber = aspekTh.dataset.tujuan;
            
            document.getElementById('tema-container').colSpan -= 4;
            document.getElementById('dimensi-container').colSpan -= 4;
            document.getElementById(`tujuan${tujuanNumber}-container`).colSpan -= 4;

            const penilaianRow = document.getElementById('penilaian-row');
            const startIndex = aspekIndex * 4;
            for (let i = 0; i < 4; i++) {
                if (penilaianRow.cells[startIndex]) {
                    penilaianRow.cells[startIndex].remove();
                }
            }

            const bodyStartIndex = startIndex + 1; // +1 for the name column
            tableBody.querySelectorAll('tr').forEach(row => {
                for (let i = 0; i < 4; i++) {
                    if (row.cells[bodyStartIndex]) {
                        row.cells[bodyStartIndex].remove();
                    }
                }
            });

            aspekTh.remove();

            document.querySelectorAll('#student-table-body tr').forEach(updateCapaian);
            setStickyHeader();
            saveStateToLocalStorage();
        }

        // --- CAPAIAN GENERATION LOGIC ---
        document.getElementById('main-table').addEventListener('change', function(event) {
            if (event.target.type === 'radio' || event.target.tagName === 'SELECT') {
                const studentRow = event.target.closest('tr');
                if (studentRow && studentRow.parentElement.tagName === 'TBODY') {
                    updateCapaian(studentRow);
                } else {
                    document.querySelectorAll('#student-table-body tr').forEach(updateCapaian);
                }
                saveStateToLocalStorage();
            }
        });
        document.getElementById('main-table').addEventListener('input', function(event) {
             if (event.target.type === 'text' && event.target.closest('#aspek-row')) {
                 document.querySelectorAll('#student-table-body tr').forEach(updateCapaian);
                 saveStateToLocalStorage();
             }
             if (event.target.id === 'tema-input') {
                 saveStateToLocalStorage();
             }
        });

        function getTujuanDescription(studentRow, tujuanNumber, tujuanText) {
            if (!tujuanText || tujuanText.startsWith('--')) return null;
        
            const assessedAspects = [];
            const aspekHeaders = document.querySelectorAll(`#aspek-row th[data-tujuan="${tujuanNumber}"]`);
        
            aspekHeaders.forEach(aspekTh => {
                const aspekInput = aspekTh.querySelector('input[data-aspek-id]');
                if (!aspekInput) return;
                const aspekText = aspekInput.value.trim();
                const aspekId = aspekInput.dataset.aspekId;
        
                if (aspekText) {
                    const checkedRadio = studentRow.querySelector(`input[name="${studentRow.dataset.studentId}-${aspekId}"]:checked`);
                    if (checkedRadio) {
                        const value = checkedRadio.dataset.value;
                        assessedAspects.push({
                            score: scoreMap[value],
                            description: `<strong>${valueMap[value]}</strong> dalam aspek "${aspekText}"`
                        });
                    }
                }
            });
        
            if (assessedAspects.length > 0) {
                assessedAspects.sort((a, b) => b.score - a.score);
                const sortedDescriptions = assessedAspects.map(a => a.description);
                const joinedDescriptions = new Intl.ListFormat('id', { style: 'long', type: 'conjunction' }).format(sortedDescriptions);
                return `Pada tujuan "${tujuanText}", ananda menunjukkan kemampuan ${joinedDescriptions}`;
            }
            
            return null;
        }

        function updateCapaian(studentRow) {
            if (!studentRow || !studentRow.dataset.studentId) return;

            const tujuan1Text = tujuan1Select.options[tujuan1Select.selectedIndex].text;
            const tujuan2Text = tujuan2Select.options[tujuan2Select.selectedIndex].text;
            const tujuan3Text = tujuan3Select.options[tujuan3Select.selectedIndex].text;

            const finalDescriptions = [];
            const desc1 = getTujuanDescription(studentRow, 1, tujuan1Text);
            if (desc1) finalDescriptions.push(desc1);
            const desc2 = getTujuanDescription(studentRow, 2, tujuan2Text);
            if (desc2) finalDescriptions.push(desc2);
            const desc3 = getTujuanDescription(studentRow, 3, tujuan3Text);
            if (desc3) finalDescriptions.push(desc3);
            
            const capaianInput = studentRow.querySelector('.capaian-input');
            const newContent = finalDescriptions.join('; <br><br>');
            
            if (capaianInput.innerHTML !== newContent) {
                capaianInput.classList.remove('visible');
                setTimeout(() => {
                    capaianInput.innerHTML = newContent;
                    if (newContent) {
                        capaianInput.classList.add('visible');
                    }
                }, 250);
            }
        }

        // --- STICKY HEADER LOGIC ---
        function setStickyHeader() {
            const headerRows = document.querySelectorAll('thead tr');
            let cumulativeHeight = 0;
            headerRows.forEach(row => {
                const cells = Array.from(row.children).filter(child => child.tagName === 'TH');
                cells.forEach(cell => {
                    cell.style.position = 'sticky';
                    cell.style.top = `${cumulativeHeight}px`;
                });
                cumulativeHeight += row.getBoundingClientRect().height;
            });
        }

        // --- MODAL LOGIC ---
        const editTujuanModal = document.getElementById('editTujuanModal');
        const closeEditTujuanModalBtn = document.getElementById('closeEditTujuanModalBtn');
        const modalDimensiTitle = document.getElementById('modalDimensiTitle');
        const tujuanListContainer = document.getElementById('tujuanListContainer');
        const addTujuanBtn = document.getElementById('addTujuanBtn');
        const saveTujuanBtn = document.getElementById('saveTujuanBtn');
        const openPetunjukModalBtn = document.getElementById('openPetunjukModalBtn');
        const petunjukModal = document.getElementById('petunjukModal');
        const closePetunjukModalBtn = document.getElementById('closePetunjukModalBtn');
        const printBtn = document.getElementById('printBtn');
        const printModal = document.getElementById('printModal');
        const closePrintModalBtn = document.getElementById('closePrintModalBtn');
        const proceedPrintBtn = document.getElementById('proceedPrintBtn');
        const importConfirmModal = document.getElementById('importConfirmModal');
        const closeImportConfirmModalBtn = document.getElementById('closeImportConfirmModalBtn');
        const replaceStudentsBtn = document.getElementById('replaceStudentsBtn');
        const appendStudentsBtn = document.getElementById('appendStudentsBtn');
        const infoModal = document.getElementById('infoModal');
        const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');
        const okInfoModalBtn = document.getElementById('okInfoModalBtn');
        const infoModalTitle = document.getElementById('infoModalTitle');
        const infoModalText = document.getElementById('infoModalText');
        const infoModalIcon = document.getElementById('infoModalIcon');


        function createTujuanInput(value = "") {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-2';
            div.innerHTML = `
                <input type="text" value="${value}" class="w-full border-gray-300 rounded-md p-2 text-sm focus:ring-sky-500 focus:border-sky-500">
                <button class="delete-tujuan-btn text-red-500 hover:text-red-700 p-1 transition-transform hover:scale-110">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            div.querySelector('.delete-tujuan-btn').onclick = () => div.remove();
            return div;
        }

        function openEditTujuanModal(dimensiKey, dimensiText) {
            modalDimensiTitle.textContent = dimensiText;
            editTujuanModal.dataset.dimensiKey = dimensiKey;
            tujuanListContainer.innerHTML = '';
            tujuanData[dimensiKey].forEach(tujuan => {
                tujuanListContainer.appendChild(createTujuanInput(tujuan));
            });
            editTujuanModal.classList.add('show');
        }

        function showInfoModal(title, text, isError = false) {
            infoModalTitle.textContent = title;
            infoModalText.textContent = text;
            if (isError) {
                infoModalIcon.innerHTML = `<i class="fas fa-exclamation-triangle"></i>`;
                infoModalIcon.className = 'text-5xl text-red-500 mb-4';
            } else {
                infoModalIcon.innerHTML = `<i class="fas fa-info-circle"></i>`;
                infoModalIcon.className = 'text-5xl text-sky-500 mb-4';
            }
            infoModal.classList.add('show');
        }

        addTujuanBtn.onclick = () => {
            tujuanListContainer.appendChild(createTujuanInput());
        };

        saveTujuanBtn.onclick = () => {
            const dimensiKey = editTujuanModal.dataset.dimensiKey;
            if (!dimensiKey) return;

            const newTujuanList = [];
            tujuanListContainer.querySelectorAll('input[type="text"]').forEach(input => {
                if (input.value.trim()) {
                    newTujuanList.push(input.value.trim());
                }
            });
            tujuanData[dimensiKey] = newTujuanList;
            
            handleDimensionChange();
            
            editTujuanModal.classList.remove('show');
            saveStateToLocalStorage(); // Save after editing custom data
        };

        closeEditTujuanModalBtn.onclick = () => editTujuanModal.classList.remove('show');
        openPetunjukModalBtn.onclick = () => petunjukModal.classList.add('show');
        closePetunjukModalBtn.onclick = () => petunjukModal.classList.remove('show');
        printBtn.onclick = () => printModal.classList.add('show');
        closePrintModalBtn.onclick = () => printModal.classList.remove('show');
        closeImportConfirmModalBtn.onclick = () => importConfirmModal.classList.remove('show');
        closeInfoModalBtn.onclick = () => infoModal.classList.remove('show');
        okInfoModalBtn.onclick = () => infoModal.classList.remove('show');


        window.addEventListener('click', (event) => {
            if (event.target == editTujuanModal) editTujuanModal.classList.remove('show');
            if (event.target == printModal) printModal.classList.remove('show');
            if (event.target == petunjukModal) petunjukModal.classList.remove('show');
            if (event.target == importConfirmModal) importConfirmModal.classList.remove('show');
            if (event.target == infoModal) infoModal.classList.remove('show');
        });
        
        // --- EXCEL IMPORT/DOWNLOAD LOGIC ---
        const importExcelBtn = document.getElementById('importExcelBtn');
        const excelFileInput = document.getElementById('excel-file-input');
        const downloadExcelBtn = document.getElementById('downloadExcelBtn');

        importExcelBtn.addEventListener('click', () => excelFileInput.click());

        excelFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    importedStudentNames = json
                        .map(row => row[0])
                        .filter(name => name && (typeof name === 'string' || typeof name === 'number') && String(name).trim() !== '');

                    if (importedStudentNames.length > 0) {
                        document.getElementById('studentCount').textContent = importedStudentNames.length;
                        importConfirmModal.classList.add('show');
                    } else {
                        showInfoModal("Gagal Impor", "Tidak ada nama yang valid ditemukan di kolom pertama file Excel yang Anda pilih.", true);
                    }
                } catch (error) {
                    console.error("Error reading Excel file:", error);
                    showInfoModal("Gagal Membaca File", "Terjadi kesalahan saat membaca file Excel. Pastikan format file benar.", true);
                }
            };
            reader.readAsArrayBuffer(file);
            event.target.value = '';
        });

        replaceStudentsBtn.addEventListener('click', () => {
            tableBody.innerHTML = '';
            importedStudentNames.forEach(name => addStudentRow(String(name), null, true));
            importConfirmModal.classList.remove('show');
            saveStateToLocalStorage();
        });

        appendStudentsBtn.addEventListener('click', () => {
            importedStudentNames.forEach(name => addStudentRow(String(name), null, false));
            importConfirmModal.classList.remove('show');
            saveStateToLocalStorage();
        });

        downloadExcelBtn.addEventListener('click', function() {
            const wb = XLSX.utils.book_new();
            const ws_data = [];
            const table = document.getElementById('main-table');
            const merges = [];

            const colorMap = {
                'header-aspek-1': 'fbbf24', 'header-aspek-2': '4ade80',
                'header-aspek-3': '60a5fa', 'header-aspek-4': 'a78bfa',
                'header-aspek-5': 'f87171', 'header-aspek-6': 'fb923c',
                'bg-yellow-50/50': 'fefce8', 'bg-green-50/50': 'f0fdf4',
                'bg-blue-50/50': 'eff6ff', 'bg-purple-50/50': 'faf5ff',
                'bg-red-50/50': 'fef2f2', 'bg-orange-50/50': 'fff7ed'
            };

            function getCellStyle(element) {
                const style = {
                    alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
                    font: {},
                    fill: { fgColor: { rgb: "FFFFFF" } },
                    border: {
                        top: { style: "thin", color: { rgb: "D1D5DB" } }, bottom: { style: "thin", color: { rgb: "D1D5DB" } },
                        left: { style: "thin", color: { rgb: "D1D5DB" } }, right: { style: "thin", color: { rgb: "D1D5DB" } }
                    }
                };
                if (element.classList.contains('font-semibold') || element.tagName === 'STRONG' || element.tagName === 'B') style.font.bold = true;
                for (const className in colorMap) {
                    if (element.classList.contains(className)) {
                        style.fill.fgColor.rgb = colorMap[className];
                        break;
                    }
                }
                if (element.classList.contains('text-left')) style.alignment.horizontal = 'left';
                if (element.classList.contains('text-right')) style.alignment.horizontal = 'right';
                return style;
            }

            const allRows = table.querySelectorAll('tr');
            allRows.forEach((tr, r_idx) => {
                if (!ws_data[r_idx]) ws_data[r_idx] = [];
                let c_idx = 0;
                tr.querySelectorAll('th, td').forEach(cellElement => {
                    while (ws_data[r_idx][c_idx]) { c_idx++; }
                    
                    const colspan = cellElement.colSpan || 1;
                    const rowspan = cellElement.rowSpan || 1;
                    
                    let cellValue;
                    if (cellElement.tagName === 'TH') {
                        if (cellElement.id === 'dimensi-container') {
                            cellValue = document.getElementById('dimensi-multiselect-button').querySelector('span').textContent.trim();
                        } else if (cellElement.querySelector('textarea')) {
                            cellValue = cellElement.querySelector('textarea').value;
                        } else if (cellElement.querySelector('select')) {
                            cellValue = cellElement.querySelector('select').options[cellElement.querySelector('select').selectedIndex].text;
                        } else if (cellElement.querySelector('input')) {
                            cellValue = cellElement.querySelector('input').value;
                        } else {
                            cellValue = cellElement.textContent.trim();
                        }
                    } else {
                        if (cellElement.hasAttribute('contenteditable')) {
                            cellValue = cellElement.innerText;
                        } else if (cellElement.querySelector('input[type="radio"]')) {
                            const radio = cellElement.querySelector('input[type="radio"]');
                            cellValue = radio.checked ? radio.dataset.value : "";
                        } else if (cellElement.classList.contains('capaian-cell')) {
                            cellValue = cellElement.querySelector('.capaian-input').innerText.replace(/<br\s*\/?>/gi, "\n");
                        } else {
                            cellValue = cellElement.innerText;
                        }
                    }

                    const style = getCellStyle(cellElement);
                    if (cellElement.classList.contains('capaian-cell')) style.alignment.horizontal = 'left';
                    
                    const cell = { v: cellValue, t: 's', s: style };

                    for (let ri = 0; ri < rowspan; ri++) {
                        for (let ci = 0; ci < colspan; ci++) {
                            const target_r = r_idx + ri;
                            const target_c = c_idx + ci;
                            if (!ws_data[target_r]) ws_data[target_r] = [];
                            ws_data[target_r][target_c] = (ri === 0 && ci === 0) ? cell : { v: "", t: 's', s: getCellStyle(cellElement) };
                        }
                    }
                    
                    if (rowspan > 1 || colspan > 1) {
                        merges.push({ s: { r: r_idx, c: c_idx }, e: { r: r_idx + rowspan - 1, c: c_idx + colspan - 1 } });
                    }
                    c_idx += colspan;
                });
            });
            
            const today = new Date();
            const formattedDate = today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
            ws_data.push([]);
            ws_data.push([{v: "Tanggal Download:", t:'s'}, {v: formattedDate, t:'s'}]);
            ws_data.push([]);
            ws_data.push([]);
            ws_data.push([{v: "BIntang Adhi Permana", t:'s'}]);
            ws_data.push([{v: "NIP 081310051985", t:'s'}]);

            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            ws['!merges'] = merges;

            const colWidths = ws_data[0].map((_, i) => {
                if (i === 0) return { wch: 30 };
                if (i >= ws_data[0].length - 1) return { wch: 50 };
                return { wch: 5 };
            });
             ws['!cols'] = colWidths;

            XLSX.utils.book_append_sheet(wb, ws, "Bangbin Koku");
            XLSX.writeFile(wb, "Bangbin_Nilai_Kokurikuler.xlsx");
        });

        // --- LOCALSTORAGE, BACKUP, AND RESTORE LOGIC ---
        function saveStateToLocalStorage() {
            const state = {
                tema: temaInput.value,
                selectedDimensions: Array.from(dimensiMultiSelectPanel.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
                selectedTujuan: {
                    tujuan1: tujuan1Select.value,
                    tujuan2: tujuan2Select.value,
                    tujuan3: tujuan3Select.value,
                },
                aspects: [],
                students: [],
                tujuanData: tujuanData
            };

            document.querySelectorAll('#aspek-row th').forEach(th => {
                const input = th.querySelector('input[data-aspek-id]');
                if (input) {
                    state.aspects.push({
                        id: input.dataset.aspekId,
                        text: input.value,
                        tujuan: th.dataset.tujuan
                    });
                }
            });

            tableBody.querySelectorAll('tr').forEach(row => {
                const studentId = row.dataset.studentId;
                const student = {
                    id: studentId,
                    name: row.cells[0].textContent,
                    ratings: {}
                };
                row.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
                    // FIX: Robustly get aspekId, avoiding split issue with studentId
                    const aspekId = radio.name.substring(studentId.length + 1);
                    student.ratings[aspekId] = radio.dataset.value;
                });
                state.students.push(student);
            });

            try {
                if (window.saveTimeout) clearTimeout(window.saveTimeout);
                window.saveTimeout = setTimeout(() => {
                    localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
                }, 500);
            } catch (e) {
                console.error("Error saving state to localStorage:", e);
                showInfoModal("Gagal Menyimpan", "Gagal menyimpan data ke browser. Mungkin penyimpanan penuh.", true);
            }
        }

        function loadStateFromLocalStorage() {
            const savedStateJSON = typeof PRELOADED_STATE !== "undefined" ? JSON.stringify(PRELOADED_STATE) : localStorage.getItem(APP_STATE_KEY);
            if (!savedStateJSON) {
                initialStudents.forEach(student => addStudentRow(student, null, true));
                return;
            }

            try {
                const state = JSON.parse(savedStateJSON);
                
                // PART 1: Restore non-table data
                if(state.tujuanData) tujuanData = state.tujuanData;
                buildMultiSelectDimensi();
                temaInput.value = state.tema || '';
                if (state.selectedDimensions) {
                    state.selectedDimensions.forEach(dimKey => {
                        const checkbox = dimensiMultiSelectPanel.querySelector(`input[value="${dimKey}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
                handleDimensionChange(); // Populates dropdowns
                if (state.selectedTujuan) {
                    tujuan1Select.value = state.selectedTujuan.tujuan1 || '';
                    tujuan2Select.value = state.selectedTujuan.tujuan2 || '';
                    tujuan3Select.value = state.selectedTujuan.tujuan3 || '';
                }

                // PART 2: Rebuild the table header from scratch
                const aspekRow = document.getElementById('aspek-row');
                const penilaianRow = document.getElementById('penilaian-row');
                aspekRow.innerHTML = '';
                penilaianRow.innerHTML = '';

                const aspects = (state.aspects && state.aspects.length > 0) ? state.aspects : [
                    { id: `aspek-${Date.now()}-1`, text: '', tujuan: '1' },
                    { id: `aspek-${Date.now()}-2`, text: '', tujuan: '2' },
                    { id: `aspek-${Date.now()}-3`, text: '', tujuan: '3' }
                ];
                
                // Sort to ensure correct column order
                aspects.sort((a, b) => a.tujuan - b.tujuan);

                const tujuanCounts = { 1: 0, 2: 0, 3: 0 };
                aspects.forEach(aspect => {
                    if (tujuanCounts[aspect.tujuan] !== undefined) tujuanCounts[aspect.tujuan]++;
                });

                const t1ColSpan = Math.max(1, tujuanCounts[1]) * 4;
                const t2ColSpan = Math.max(1, tujuanCounts[2]) * 4;
                const t3ColSpan = Math.max(1, tujuanCounts[3]) * 4;
                const totalColSpan = t1ColSpan + t2ColSpan + t3ColSpan;

                document.getElementById('tema-container').colSpan = totalColSpan;
                document.getElementById('dimensi-container').colSpan = totalColSpan;
                document.getElementById('tujuan1-container').colSpan = t1ColSpan;
                document.getElementById('tujuan2-container').colSpan = t2ColSpan;
                document.getElementById('tujuan3-container').colSpan = t3ColSpan;

                let totalAspekCount = 0;
                aspects.forEach(aspect => {
                    const aspekCountForTujuan = Array.from(aspekRow.querySelectorAll(`th[data-tujuan="${aspect.tujuan}"]`)).length + 1;
                    const newAspekTh = document.createElement('th');
                    newAspekTh.colSpan = 4;
                    newAspekTh.className = 'whitespace-normal px-2 py-1';
                    newAspekTh.dataset.tujuan = aspect.tujuan;
                    
                    const hasDeleteButton = aspekRow.cells.length > 2; // Allow deleting if more than 3 aspects exist
                    const deleteButtonHTML = `<button class="delete-aspek-btn bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex-shrink-0 flex items-center justify-center text-lg font-bold shadow-md transition transform hover:scale-110" title="Hapus Aspek Ini"><i class="fa-solid fa-minus"></i></button>`;
                    
                    newAspekTh.innerHTML = `
                        <div class="flex items-center gap-2">
                            <input type="text" data-aspek-id="${aspect.id}" value="${aspect.text}" placeholder="Aspek ${aspekCountForTujuan}" class="font-normal bg-white/70 border-slate-200 text-sm w-full p-2 rounded-md text-center flex-grow">
                            ${hasDeleteButton ? deleteButtonHTML : ''}
                        </div>
                    `;
                    aspekRow.appendChild(newAspekTh);
                    
                    if (hasDeleteButton) {
                        newAspekTh.querySelector('.delete-aspek-btn').addEventListener('click', () => deleteAspek(newAspekTh));
                    }
                    newAspekTh.querySelector('input').addEventListener('input', saveStateToLocalStorage);

                    const headerBgColor = headerBgClasses[totalAspekCount % headerBgClasses.length];
                    radioValues.forEach(val => {
                        const newPenilaianTh = document.createElement('th');
                        newPenilaianTh.className = `header-aspek ${headerBgColor}`;
                        newPenilaianTh.textContent = val;
                        penilaianRow.appendChild(newPenilaianTh);
                    });
                    totalAspekCount++;
                });

                // PART 3: Rebuild student rows and populate data
                tableBody.innerHTML = '';
                const studentsToLoad = (state.students && state.students.length > 0) ? state.students : initialStudents.map(name => ({ id: crypto.randomUUID(), name, ratings: {} }));

                studentsToLoad.forEach(student => {
                    addStudentRow(student.name, student.id, true);
                    const row = tableBody.querySelector(`tr[data-student-id="${student.id}"]`);
                    if (row && student.ratings) {
                        Object.entries(student.ratings).forEach(([aspekId, value]) => {
                            const radio = row.querySelector(`input[name="${student.id}-${aspekId}"][data-value="${value}"]`);
                            if (radio) radio.checked = true;
                        });
                    }
                });

                // PART 4: Final UI updates
                document.querySelectorAll('#student-table-body tr').forEach(updateCapaian);
                setStickyHeader();

            } catch (e) {
                console.error("Error loading state from localStorage:", e);
                localStorage.removeItem(APP_STATE_KEY);
                showInfoModal("Gagal Memuat Data", "Data tersimpan rusak dan telah dihapus. Silakan mulai dari awal atau pulihkan dari backup.", true);
                tableBody.innerHTML = '';
                initialStudents.forEach(student => addStudentRow(student, null, true));
            }
        }

        document.getElementById('backupBtn').addEventListener('click', () => {
            try {
                const appState = localStorage.getItem(APP_STATE_KEY);
                if (!appState) {
                    showInfoModal("Backup Gagal", "Tidak ada data untuk di-backup.", true);
                    return;
                }
                const blob = new Blob([appState], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const date = new Date().toISOString().slice(0, 10);
                a.download = `backup-bangbinKoku-${date}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showInfoModal("Backup Berhasil", "File backup telah diunduh.");
            } catch (e) {
                console.error("Backup error:", e);
                showInfoModal("Backup Gagal", "Terjadi kesalahan saat membuat file backup.", true);
            }
        });

        const restoreFileInput = document.getElementById('restore-file-input');
        document.getElementById('restoreBtn').addEventListener('click', () => {
            restoreFileInput.click();
        });

        restoreFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    JSON.parse(content); 
                    localStorage.setItem(APP_STATE_KEY, content);
                    showInfoModal("Restore Berhasil", "Data telah dipulihkan. Halaman akan dimuat ulang untuk menerapkan perubahan.");
                    setTimeout(() => window.location.reload(), 2000);
                } catch (error) {
                    console.error("Restore error:", error);
                    showInfoModal("Restore Gagal", "File backup tidak valid atau rusak. Pastikan Anda memilih file JSON yang benar.", true);
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        });

        document.getElementById('downloadPageBtn').addEventListener('click', () => {
            saveStateToLocalStorage();
            const currentStateJSON = localStorage.getItem(APP_STATE_KEY);
            if (!currentStateJSON) {
                showInfoModal("Gagal", "Tidak ada data untuk diunduh.", true);
                return;
            }

            const clonedDocument = document.documentElement.cloneNode(true);
            const mainScript = clonedDocument.querySelector('body > script');
            if (!mainScript) {
                 showInfoModal("Gagal", "Tidak dapat menemukan skrip utama untuk menyematkan data.", true);
                 return;
            }

            const preloaderScript = `const PRELOADED_STATE = ${currentStateJSON};\n\n`;
            mainScript.textContent = preloaderScript + mainScript.textContent;
            
            const blob = new Blob([clonedDocument.outerHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
a.href = url;
            a.download = 'BANGBIN_KOKU2025.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        proceedPrintBtn.addEventListener('click', () => {
            // 1. Ambil semua data dari input modal dan halaman
            const namaGuru = document.getElementById('namaGuruInput').value || "Bintang A. Permana";
            const nipGuru = document.getElementById('nipGuruInput').value || "081310051985";
            const namaKepsek = document.getElementById('namaKepsekInput').value || "RIizky Arlini, M.Pd";
            const nipKepsek = document.getElementById('nipKepsekInput').value || "1980403201852001";
            
            const tema = temaInput.value;
            const dimensi = dimensiMultiSelectButton.querySelector('span').textContent;
            const tujuan = [tujuan1Select, tujuan2Select, tujuan3Select]
                .map(sel => sel.options[sel.selectedIndex].text)
                .filter(text => !text.startsWith('--'))
                .join(', ');

            // 2. Inisialisasi dokumen jsPDF (ukuran A4, orientasi potret)
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            // 3. Tambahkan judul dan informasi header
            doc.setFontSize(16);
            doc.text('LAPORAN PENILAIAN KEGIATAN KOKURIKULER', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
            doc.setLineWidth(0.5);
            doc.line(20, 18, 190, 18); // Garis bawah judul

            doc.setFontSize(10);
            const infoStartY = 25;
            doc.text('Tema:', 20, infoStartY);
            doc.text(tema || 'Tidak diisi', 60, infoStartY);
            doc.text('Dimensi:', 20, infoStartY + 7);
            doc.text(dimensi || 'Tidak diisi', 60, infoStartY + 7);
            doc.text('Tujuan Pembelajaran:', 20, infoStartY + 14);
            const tujuanLines = doc.splitTextToSize(tujuan || 'Tidak diisi', 125); // Bungkus teks jika panjang
            doc.text(tujuanLines, 60, infoStartY + 14);

            // 4. Siapkan data untuk tabel
            const head = [['Nama Siswa', 'Capaian']];
            const body = [];
            tableBody.querySelectorAll('tr').forEach(row => {
                const name = row.cells[0].textContent;
                const capaian = row.querySelector('.capaian-input').innerText;
                body.push([name, capaian]);
            });

            // 5. Buat tabel menggunakan jsPDF-AutoTable
            const tableStartY = infoStartY + 14 + (tujuanLines.length * 5) + 2;
            doc.autoTable({
                head: head,
                body: body,
                startY: tableStartY,
                headStyles: { fillColor: [242, 242, 242], textColor: [40, 40, 40], fontStyle: 'bold' },
                columnStyles: {
                    0: { cellWidth: 50 }, // Lebar kolom Nama Siswa
                    1: { cellWidth: 'auto' }  // Lebar kolom Capaian otomatis
                },
                theme: 'grid'
            });

            // 6. Tambahkan blok tanda tangan di bawah tabel
            const finalY = doc.lastAutoTable.finalY || tableStartY; // Dapatkan posisi akhir tabel
            let signatureY = finalY + 15;

            // Jika tidak cukup ruang, tambahkan halaman baru
            if (signatureY > doc.internal.pageSize.getHeight() - 40) {
                doc.addPage();
                signatureY = 20; // Atur ulang posisi Y di halaman baru
            }

            const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            doc.setFontSize(10);
            
            // Tanda tangan Kepala Sekolah (kiri)
            doc.text('Mengetahui,', 45, signatureY, { align: 'center' });
            doc.text('Kepala Sekolah', 45, signatureY + 5, { align: 'center' });
            doc.text(namaKepsek, 45, signatureY + 25, { align: 'center' });
            doc.text(`NIP. ${nipKepsek}`, 45, signatureY + 30, { align: 'center' });

            // Tanda tangan Guru (kanan)
            doc.text(`Bekasi, ${today}`, 155, signatureY, { align: 'center' });
            doc.text('Guru Mata Pelajaran', 155, signatureY + 5, { align: 'center' });
            doc.text(namaGuru, 155, signatureY + 25, { align: 'center' });
            doc.text(`NIP. ${nipGuru}`, 155, signatureY + 30, { align: 'center' });

            // 7. Simpan file PDF
            doc.save('Laporan_Kokurikuler.pdf');
            printModal.classList.remove('show');
        });


        // --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            buildMultiSelectDimensi();
            loadStateFromLocalStorage();
            setTimeout(setStickyHeader, 100); 
        });
        window.addEventListener('resize', setStickyHeader);