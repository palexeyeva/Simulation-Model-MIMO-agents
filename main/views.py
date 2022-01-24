from django.http import request
from django.http import response
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404, render
import requests
import random as ran
import random2
import numpy as np
from random import randint
import matplotlib.pyplot as plt
from matplotlib.ticker import (MultipleLocator, FormatStrFormatter, AutoMinorLocator)
from matplotlib.collections import LineCollection
from matplotlib import colors as mcolors
import matplotlib.gridspec as gridspec
import io
from io import *
from matplotlib.backends.backend_agg import FigureCanvasAgg
import base64

import scipy.stats as ss


def index(request):

    def randNormal(m):
        x = m*np.random.randn(1)
        return(x[0] if x[0]>=0 else randNormal(m))   

    n = 0
    R = []
    Th = []
    mem = []
    disc = []
    init = []
    st = []
    fig = plt.figure(figsize=(10, 10), constrained_layout = True)
    iter = 0
    prt = {}
    p = []
    net = {}

    if request.method == 'POST':
        n = int(request.POST['count'])      
        
        cntType = int(request.POST['cntType'])

        try: 
            flS = request.POST['checkboxSave']
            flagSave = True
        except:
            flagSave = False

        #Проверка наличия флага на фиксацию параметров
        try: 
            m_str = request.POST['matrix_str']
            matrix_str = request.POST['matrix_str1']
            matrix = matrix_str[2:-2]
            l = []
            for i in matrix.split('], ['):
                l.append([int(j) for j in i.split(', ')])
            R = l            
        except:
            #Полный граф
            if request.POST['graphOptions'] == 'СompleteGraph':
                for i in range(n):
                    g = []
                    for j in range(n):
                        if (i != j) :
                            g.append(1)
                        else:
                            g.append(0)
                    R.append(g)
            elif request.POST['graphOptions'] == 'ERGraph':
                values = [0, 1]
                g = [ran.choices(values, weights=[0.2, 0.8], k = n) for y in range(n)]
                for i in range(n):
                    k = 0
                    for j in range(n):
                        if g[i][j] == 1:
                            k = k + 1
                    j = i
                    for l in range(n):
                        if g[l][j] == 1: 
                            k = k + 1
                    if k == 0:
                        g[i][randint(0, (n/2)-1)] = 1
                for i in range(n):
                    for j in range(n):
                        if i == j:
                            g[i][j] = 0
                R = g.copy()
        # print(R)
        #Проверка на фиксацию порогов
        try:
            T_str = request.POST['Th_str']
            Th_str = request.POST['Th_str1']
            Th = Th_str[1:-1]
            Th = [float(i) for i in Th.split(', ')]
        except:
            Th = []
            cnt = 0
            while cnt < n:
                Th.append(randNormal(1))
                cnt += 1
        # print(Th)

        #Проверка на фиксацию начального состояния сети
        try:
            i_str = request.POST['init_str']
            init_str = request.POST['init_str1']
            init = init_str[1:-2]
            init =[int(i) for i in init.split(' ')]
        except:
            init = np.random.randint(0, cntType + 1, n)            
        # print(init)

        #Проверка на фиксацию глубины памяти        
        try:
            me_str = request.POST['mem_str']
            mem_str = request.POST['mem_str1']
            mem = mem_str[1:-1]
            mem = [int(i) for i in mem.split(', ')]
        except:
            for i in range(n):
                mem.append(1)
            # mem = np.random.randint(1, 4, n)  
        
        #Проверка на фиксацию коэф. дисконтирования
        try:
            d_str = request.POST['disc_str']
            disc_str = request.POST['disc_str1']
            disc = disc_str[1:-1]
            disc = [int(i) for i in disc.split(', ')]
        except:
            for i in range(n):
                disc.append(1)
            # disc = np.random.uniform(0, 1, n)

        #Проверка на фиксацию стохастического вектора
        try:
            s_str = request.POST['st_str']
            st_str = request.POST['st_str1']
            st = st_str[2:-2]
            l = []
            for i in st.split('], ['):
                l.append([float(j) for j in i.split(', ')])
            st = l
        except:
            if request.POST['vectOptions'] == 'Uniform':
                for i in range(n):
                    g = []
                    p = []
                    p_sum = 0
                    x = np.random.uniform(0, 1, cntType)
                    for j in range(cntType):
                        p.append(x[j])
                        p_sum += x[j]
                    for k in range(cntType):
                        g.append(p[k]/p_sum)                
                    st.append(g)   
            elif request.POST['vectOptions'] == 'Beta':
                 for i in range(n):
                    g = []
                    p = []
                    y = []
                    p_sum = 0
                    for j in range(cntType):                        
                        h = ran.betavariate(0.1, 0.1)
                        while h < 0.1 or h >1:
                            h = ran.betavariate(0.1, 0.1)
                        y.append(h)
                    for j in range(cntType):
                        p.append(y[j])
                        p_sum += y[j]
                    for k in range(cntType):
                        g.append(p[k]/p_sum)                
                    st.append(g) 

        # print(st)

        iter = int(request.POST['iter'])
    
        net = {
            'count': n,
            'matrix' : R,
            'Th': Th,
            'init': init,
            'mem': mem,
            'disc': disc,
            'st': st, 
            'iter': iter, 
            'cntType': cntType
        }

        prt = {
            't': [0],
            'iner': [],
            'state': [init]
        }


        n = int(n)
        initial = net['init']
        memory = net['mem']
        p = net['st']
        discount = net['disc']        

        plotState = list()
        inerState = list()
        for i in range(n):
            inerState.append([[0, 0]])
        plotState.append(net['init'])
        fl = 1
        t = 1
        state = initial.copy()

        curMem = []

        for i in range(n):
            b = np.ones((memory[i], cntType))
            curMem.append(b)
        for i in range(n):
            for j in range(memory[i]): 
                for k in range(cntType):
                    curMem[i][j][k] = curMem[i][j][k]*0

        
        while fl == 1:
            step = 0
            while step < iter:

                e = []
                e = np.zeros(cntType)
                sumAct = np.zeros(cntType) 
                for j in range(n):
                    flag = 0
                    for i in range(n):
                        if initial[i] > 0:
                            u = initial[i] - 1
                            e[u] = e[u] + p[j][u] * R[i][j]

                    curMem[j][0][initial[j] - 1] += e[initial[j] - 1]

                    for i in range(memory[j]):
                        if i + 2 <= memory[j] and memory[j] != 1:
                            for k in range(cntType):
                                curMem[j][i+1][k] = curMem[j][i+1][k] * discount[j]
                    if memory[j] == 1:
                        for i in range(cntType):
                            sumAct[i] = e[i]
                    else:
                        for i in range(memory[j]):
                            for k in range(cntType):
                                sumAct[k] += curMem[j][i][k]
                    
                    #условия активации агента
                    for k in range(cntType):
                        flA = 0
                        for i in range(cntType):
                            if sumAct[k] == sumAct[i]:
                                flA += 1
                    if np.sum(sumAct) >= Th[j] and flA != cntType:
                        state[j] = np.argmax(sumAct) + 1
                        flag = 1
                    elif np.sum(sumAct) >= Th[j] and flA == cntType:
                        for k in range(cntType):
                            flP = 0
                            for i in range(cntType):
                                if p[j][k] == p[j][i]:
                                    flP += 1
                        if flP < cntType:
                            state[j] = p[j].index(max(p[j])) + 1
                            flag = 1
                        else:
                            state[j] = ran.randint(1, cntType)
                            flag = 1
                    else:
                        state[j] = 0

                    inerState[j].append(sumAct)
                    e = []
                    e = np.zeros(cntType)
                    sumAct = []
                    sumAct = np.zeros(cntType) 
                    if flag == 1:
                        for i in range(n):
                            for j in range(memory[i]): 
                                for k in range(cntType):
                                    curMem[i][j][k] = curMem[i][j][k]*0

                initial = state.copy()
                plotState.append(initial)
                prt['t'].append(t)
                prt['state'].append(initial)

                t += 1
                step += 1

            prop = []
            timePeriod = [f"t{i}" for i in range(t)]
            x = np.arange(t)
            y = []

            #определение координат графика, доля типа
            actType = 3
            for i in plotState:
                tot_el = 0
                d = {}
                for j in range(cntType+1):
                    d[j] = 0
                for j in i:
                    d[j] += 1
                    tot_el += 1
                for j in d: 
                    d[j] = d[j] / tot_el
                prop.append(d)

            y = []
            for i in range(cntType+1):
                g = []
                for dic in prop:
                    g.append(dic[i])
                y.append(g)

            y.append(y.pop(0))

            #построение графика
            mycolors = ['tab:blue', 'tab:green', 'tab:pink', 'tab:red', 'tab:grey', 'tab:orange', 'tab:brown']
            labs = [f"Тип активности {i+1}" for i in range(cntType)]
            labs.append('Не активен')

            plt.stackplot(x, y, labels=labs, colors=mycolors, alpha=0.8)
            plt.legend(fontsize=10, ncol=4)
            plt.xlim(x[0], x[-1])
            plt.xlabel('Такт')
            plt.ylabel('Доля')

            iSt = []
            for k in range(int(t)):
                j = []
                for i in range(int(n)):
                    g = inerState[i][k].copy()
                    j.append(g)
                iSt.append(j)


            prt['iner'].extend(iSt)
            p = zip(prt['t'], prt['state'], prt['iner'])
            
            fl = int(0)
        
        if flagSave:
            with open("out.txt", 'w') as out:
                for key,val in net.items():
                    out.write('{}:{}\n'.format(key,val))


    imgdata = BytesIO()
    fig.savefig(imgdata, format='png', bbox_inches='tight')
    imgdata.seek(0)

    encoded = base64.b64encode(imgdata.getvalue())
    data = '<img id="graph" src="data:image/png;base64, {}">'.format(encoded.decode('utf-8'))


    context = {
        'data': data,
        'prt': p
    }  



    return render(request, 'index.html', context)