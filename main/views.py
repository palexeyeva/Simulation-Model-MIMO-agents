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
import itertools
import plotly.graph_objects as go
import networkx as nx
import scipy.stats as ss
from networkx.generators.random_graphs import barabasi_albert_graph
from networkx.generators.random_graphs import watts_strogatz_graph
import pandas as pd
import vk_api
import json

#Генерация нормального распределения
def randNormal(m):
    x = m*np.random.randn(1)
    return(x[0] if x[0]>=0 else randNormal(m))   

#Перевод матрицы к графу
def getGraph(n, R):
    graph = nx.DiGraph()

    N_range = range(n)
    graph.add_nodes_from(N_range)

    for i in range(n):
        for j in range(n):
            if R[i][j] > 0:
                graph.add_edge(i,j)                

    return graph
    
#Генерация цветов графа
def colorGen(indexStop, plotState, n):
    clrId = []
    colors = []
    for i in range(n):
        clrId.append(plotState[indexStop][i])
    clrDate = ['Pink', 'b', 'g','r' , 'Orange', 'Brown']
    for i in range(n):
        colors.append(clrDate[clrId[i]])   

    return colors  

def compliteGraph(n):
    R = []
    for i in range(n):
        g = []
        for j in range(n):
            if (i != j) :
                g.append(1)
            else:
                g.append(0)
        R.append(g)

    return R

def ErdosRenyiGraph(n):
    values = [0, 1]
    g = [ran.choices(values, weights=[0.5, 0.5], k = n) for y in range(n)]
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
    return g

def random_graphBA(n, p) -> nx.DiGraph:
  graph = barabasi_albert_graph(n, p, seed=None, initial_graph=None)  

  N_range = range(n)
  graph.add_nodes_from(N_range)

  return graph

def convertMatrix(G, n):
    P = nx.convert_matrix.to_numpy_array(G)
    R = []
    for i in range(n):
        g = []
        for j in range(n):
            g.append(int(P[i][j]))
        R.append(g)

    k = int(np.random.randint(n, (n*n/2), 1))
    l = np.random.randint(0, n, k)
    m = np.random.randint(0, n, k)
    for i in range(k):
        if l[i] != m[i]:
            R[l[i]][m[i]] = 0
    
    return R

def BarabasiAlbertGraph(n):
    G = random_graphBA(n, 2)
    R = convertMatrix(G, n)

    return R


def WattsStrogatzGraph(n, k, p):  
    G = watts_strogatz_graph(n, k, p, seed=None)  

    N_range = range(n)
    G.add_nodes_from(N_range)

    R = convertMatrix(G, n)

    return R

def twoCompliteGraphs(n):
    count = int(n/2)

    T = BarabasiAlbertGraph(count)
    M = BarabasiAlbertGraph(n - count)
    # T = WattsStrogatzGraph(count, 4, 0.5)
    # M = WattsStrogatzGraph(n - count, 4, 0.5)

    R = []

    for i in range(n):
        g = []
        for j in range(n):
            if j < count and i < count:
                g.append(T[i][j])
            elif j >= count and i >= count:
                g.append(M[count - i][count - j])
            else:
                g.append(0)
        R.append(g)

    k = int(np.random.randint(count, n, 1))
    l = int(np.random.randint(0, count, 1))

    R[k][l] = 2
    
    k = int(np.random.randint(0, count, 1))
    l = int(np.random.randint(count, n, 1))

    R[k][l] = 2
    
    return R, k, l

def TwoCommunity(n):
    
    R = []

    excel_data = pd.read_excel('matrix.xlsx')
    data = pd.DataFrame(excel_data, columns=['matrix'])

    for i in range(n):
        R.append(list(map(int, data['matrix'][i].split(";"))))

    return R



def fields(request):
    
    if request.method == 'POST':
        print('test1')

    return render(request, 'fields.html')


def index(request):

    n = 0
    R = []
    Th = []
    mem = []
    disc = []
    init = []
    st = []
    iter = 0
    prt = {}
    p = []
    net = {}

    idAgent = 2 #такт для добавления влиятельного агента
    cntGraph = 10 #количество графов
    iterStop = 1 #шаг остановки 
    
    
    fig = plt.figure(figsize=(10, 25), constrained_layout = True)
    

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
            print("Матрица есть")
            for i in matrix.split('], ['):
                l.append([int(j) for j in i.split(', ')])
            R = l     
            if request.POST['graphOptions'] == 'СompleteGraph':
                plt.title("Complete Graph")
                plt.axis('off')
            elif request.POST['graphOptions'] == 'ERGraph':
                plt.title("Erdos-Renyi Graph")
                plt.axis('off')
            elif request.POST['graphOptions'] == 'BAGraph':
                plt.title("Barabasi-Albert Graph")
                plt.axis('off')
            elif request.POST['graphOptions'] == 'WSGraph':
                plt.title("Watts-Strogatz Graph")
                plt.axis('off')                  
        except:
            if request.POST['graphOptions'] == 'СompleteGraph':
                R = compliteGraph(n)
                plt.title("Complete Graph")
                plt.axis('off')
            elif request.POST['graphOptions'] == 'ERGraph':
                R = ErdosRenyiGraph(n)
                plt.title("Erdos-Renyi Graph")
                plt.axis('off')
            elif request.POST['graphOptions'] == 'Influential':
                R = BarabasiAlbertGraph(n)
                for i in range(n):
                    for j in range(n):
                        if j == n-1 or i == n-1:
                            R[i][j] = 0
            elif request.POST['graphOptions'] == 'BAGraph':
                R = BarabasiAlbertGraph(n)
                plt.title("Barabasi-Albert Graph")
                plt.axis('off')
            elif request.POST['graphOptions'] == 'TwoComplGraph':
                R, indexI, indexJ  = twoCompliteGraphs(n)
            elif request.POST['graphOptions'] == 'WSGraph':
                R = WattsStrogatzGraph(n, 3, 0.5)
                plt.title("Watts-Strogatz Graph")
                plt.axis('off')
            elif request.POST['graphOptions'] == 'TwoCommunity':
                R = TwoCommunity(n)
            elif request.POST['graphOptions'] == 'TwoCommunityVK':
                R = TwoCommunity(n)

        initR = []
        for i in range(n):
            g = []
            for j in range(n):
                    g.append(R[i][j])                
            initR.append(g)

        #Проверка на фиксацию порогов
        try:
            T_str = request.POST['Th_str']
            Th_str = request.POST['Th_str1']
            Th = Th_str[1:-1]
            Th = [float(i) for i in Th.split(' ')]
            print("Пороги есть")
        except:
            Th = []
            cnt = 0
            Th = np.random.triangular(0, 0.2, 0.7, n)
            print(Th)

        #Проверка на фиксацию начального состояния сети
        try:
            i_str = request.POST['init_str']
            init_str = request.POST['init_str1']
            init = init_str[1:-2]
            init =[int(i) for i in init.split(', ')]
            print("Начальное состояние есть")
        except:
            if request.POST['graphOptions'] == 'TwoComplGraph' :
                count = int(n/2)
                for i in range(count): 
                    init.append(1)
                for i in range(n-count):
                    init.append(2)
                print(init)
            elif request.POST['graphOptions'] == 'Influential' :
                for i in range(n): 
                    init.append(1)
                print(init)
            elif request.POST['vectOptions'] == 'Prop' :
                propN0 = int(n/3)
                propN2 = int(n/4)
                propN1 = n - propN0 - propN2
                for i in range(propN0): 
                    init.append(0)
                for i in range(propN2):
                    init.append(2)
                for i in range(propN1):
                    init.append(1)
            else:
                # init = np.random.randint(0, cntType + 1, n) 
                for i in range(n):
                    init.append(0)
        #Проверка на фиксацию глубины памяти        
        try:
            me_str = request.POST['mem_str']
            mem_str = request.POST['mem_str1']
            mem = mem_str[1:-1]
            mem = [int(i) for i in mem.split(', ')]
        except:
            for i in range(n):
                mem.append(1)
        
        #Проверка на фиксацию коэф. дисконтирования
        try:
            d_str = request.POST['disc_str']
            disc_str = request.POST['disc_str1']
            disc = disc_str[1:-1]
            disc = [int(i) for i in disc.split(', ')]
        except:
            for i in range(n):
                disc.append(1)

        #Проверка на фиксацию стохастического вектора
        try:
            s_str = request.POST['st_str']
            st_str = request.POST['st_str1']
            st = st_str[2:-2]
            l = []
            for i in st.split('], ['):
                l.append([float(j) for j in i.split(', ')])
            st = l
            print("Вектор есть")
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
                #  for i in range(n):
                #     g = []
                #     p = []
                #     y = []
                #     p_sum = 0
                #     for j in range(cntType):                        
                #         h = ran.betavariate(0.1, 0.1)
                #         while h < 0.1 or h >1:
                #             h = ran.betavariate(0.1, 0.1)
                #         y.append(h)
                #     for j in range(cntType):
                #         p.append(y[j])
                #         p_sum += y[j]
                #     for k in range(cntType):
                #         g.append(p[k]/p_sum)                
                #     st.append(g) 
                #для двух типов!!!!
                for i in range(n):
                    g = []
                    p = []
                    y = []
                    p_sum = 0

                    h = ran.betavariate(0.1, 0.1)
                    while h < 0.1 or h >0.9 and h > 0.6:
                        h = ran.betavariate(0.1, 0.1)
                    g.append(h)
                    g.append(1-h)

                    st.append(g) 
                # propN = int(n/2)
                # for i in range(propN):
                #     g = []
                #     p = []
                #     y = []
                #     p_sum = 0

                #     h = ran.betavariate(0.1, 0.1)
                #     while h < 0.1 or h >0.9 or h > 0.6:
                #         h = ran.betavariate(0.1, 0.1)
                #     g.append(h)
                #     g.append(1-h)

                #     st.append(g) 
                    
                # for i in range(n - propN):
                #     g = []
                #     p = []
                #     y = []
                #     p_sum = 0
                #     h = ran.betavariate(0.1, 0.1)
                #     while h < 0.1 or h >0.9 or h < 0.4:
                #         h = ran.betavariate(0.1, 0.1)  
                #     g.append(h)
                #     g.append(1-h)                       

                #     st.append(g) 

            elif request.POST['vectOptions'] == 'Prop' :
                # propN = int(n/2)
                # for i in range(propN):
                #     g = []
                #     p = []
                #     y = []
                #     p_sum = 0

                #     h = ran.betavariate(0.1, 0.1)
                #     while h < 0.1 or h >0.9 or h < 0.4:
                #         h = ran.betavariate(0.1, 0.1)
                #     g.append(h)
                #     g.append(1-h)

                #     st.append(g) 
                    
                # for i in range(n - propN):
                #     g = []
                #     p = []
                #     y = []
                #     p_sum = 0
                #     h = ran.betavariate(0.1, 0.1)
                #     while h < 0.1 or h >0.9 or h > 0.6:
                #         h = ran.betavariate(0.1, 0.1)  
                #     g.append(h)
                #     g.append(1-h)                       

                #     st.append(g) 
                for i in range(n):
                    g = []
                    p = []
                    y = []
                    p_sum = 0

                    h = ran.betavariate(0.1, 0.1)
                    while h < 0.1 or h >0.9 or h < 0.4:
                        h = ran.betavariate(0.1, 0.1)
                    g.append(h)
                    g.append(1-h)

                    st.append(g) 
            # if request.POST['graphOptions'] == 'TwoComplGraph':
            #     print(indexI)
            #     st[indexI][0] = 0.1
            #     st[indexI][1] = 0.9


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
        
        flagToChange = True                    
        while fl == 1:
            step = 0      
            while step < iter:
                if idAgent == step and request.POST['graphOptions'] == 'Influential':
                    for i in range(n):
                        for j in range(n):
                            # if i != j and (j == n-1 or i == n-1):
                            if  i == n - 1:
                                R[i][j] = 1
                    initial[n-1] = 2
                    Th[n-1] = 0.1
                

                if request.POST['graphOptions'] == 'TwoCommunityVK' and step % 6 != 0:
                        initial[0] = 0
                        initial[187] = 0
                elif request.POST['graphOptions'] == 'TwoCommunityVK' and step % 6 == 0:
                        if flagToChange:
                            initial[0] = 1
                            initial[187] = 0
                            flagToChange = False
                        else: 
                            initial[0] = 0
                            initial[187] = 2
                            flagToChange = True

                elif request.POST['graphOptions'] == 'TwoCommunity':
                    initial[0] = 1
                    # for i in range(n):
                    #     for j in range(n):
                    #         if  i == n - 2:
                    #             R[i][j] = 3
                    # initial[n-2] = 1
                    # Th[n-2] = 0.1

                    # R[n-2][n-1] = 0
                    # R[n-1][n-2] = 0
                    
                e = []
                e = np.zeros(cntType)
                sumAct = np.zeros(cntType)                 

                for j in range(n):
                    flag = 0
                    for i in range(n):
                        if initial[i] > 0:
                            u = initial[i] - 1
                            e[u] = e[u] + p[j][u] * R[i][j]

                   
                    for i in range(cntType):
                            curMem[j][0][i] += e[i]                    

                    for i in range(memory[j]):
                        if i + 2 <= memory[j] and memory[j] != 1:
                            for k in range(cntType):
                                curMem[j][i+1][k] = curMem[j][i][k] * discount[j]
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
                            print("случ")
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

            #---------------самый последний и ненужный такт
            # if request.POST['graphOptions'] == 'TwoCommunityVK' and step % 6 != 0:
            #         initial[0] = 13
            #         initial[187] = 14
            # elif request.POST['graphOptions'] == 'TwoCommunityVK' and step % 6 == 0:
            #         initial[0] = 15
            #         initial[187] = 16

            # elif request.POST['graphOptions'] == 'TwoCommunity':
            #         initial[0] = 1

            prop = []
            timePeriod = [f"t{i}" for i in range(t)]
            x = np.arange(t)
            y = []
            
            if request.POST['graphOptions'] == 'TwoCommunityVK':
                df = pd.DataFrame(np.transpose(plotState))

                with open('m3.csv', 'a', newline='') as f:
                    df.to_csv(f, index=False)

                print("записано")
            
            else:
                #определение координат графика, доля типа
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
                ind = int((cntGraph / 2) + 1)
                ax_1 = fig.add_subplot(ind, 2, 1)
                ax_1.set_xticks(x)

                ax = {}
                colors = []
                it = 0 
               

                if request.POST['graphOptions'] == 'Influential':    
                    G = getGraph(n-1, initR)
                else:
                    G = getGraph(n, R)
                

                for i in range(cntGraph):
                    if it < idAgent and request.POST['graphOptions'] == 'Influential':    
                        G = getGraph(n-1, initR)
                        temp = colorGen(it, plotState, n-1)
                    else:
                        G = getGraph(n, R)
                        temp = colorGen(it, plotState, n)
                    ax[str(i)] = fig.add_subplot(ind, 2, i+3)
                    ax[str(i)].set_title("Tact №" + str(it), fontsize=10)
                    ax[str(i)] = plt.gca()
                    pos = nx.circular_layout(G)     
                    ax[str(i)] = nx.draw(G, pos, node_size = 400, font_weight='bold', node_color=temp, with_labels=True)
                    
                    it += iterStop

                plt.tight_layout()


                mycolors = ['tab:blue', 'tab:green', 'tab:pink', 'tab:red', 'tab:grey', 'tab:orange', 'tab:brown']
                labs = [f"Аctivity type {i+1}" for i in range(cntType)]
                
                labs.append('Inactive')
                
                ax_1.set_xlim(x[0], x[-1])
                ax_1.set_xlabel('Tact', fontsize=8)
                ax_1.set_ylabel('Proportion', fontsize=8)
                ax_1.stackplot(x, y, labels=labs, colors=mycolors, alpha=0.8)
                ax_1.legend(bbox_to_anchor=(1, 0.6), fontsize=8, loc='center left')
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